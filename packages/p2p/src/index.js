const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const { NOISE } = require("libp2p-noise");
const MPLEX = require("libp2p-mplex");
const process = require("process");
const multiaddr = require("multiaddr");
const Bootstrap = require("libp2p-bootstrap");
const Gossipsub = require("libp2p-gossipsub");
const PubsubPeerDiscovery = require("libp2p-pubsub-peer-discovery");
const LumenConfig = require("@digitalnative/lumen-config");
// Known peers addresses
const bootstrapMultiaddrs = [
  "/ip4/127.0.0.1/tcp/30333/p2p/QmUNxWQPAxe3xJtgPUho9hPUjk1kvWAxPm6KpaRizV3kAB",
  "/ip4/127.0.0.1/tcp/51532/p2p/QmfXazgCnxLcJwHW9xtuexFwCcKG3LQXFzNq5pQEf7gegM"
];
// Chat protocol
const ChatProtocol = require("./chat-protocol");
const dir = "./lumen-config.json";
const config = new LumenConfig.default(dir);
console.log(config.bootNodes);
const { bootNodes } = config;
const PubsubChat = require("./chat");
const createRelayServer = require("libp2p-relay-server");

const createBootstrapNode = bootstrapMultiAddrs => {
  return Libp2p.create({
    addresses: {
      // add a listen address (localhost) to accept TCP connections on a random port
      listen: ["/ip4/127.0.0.1/tcp/0"]
    },
    modules: {
      transport: [TCP],
      connEncryption: [NOISE],
      streamMuxer: [MPLEX],
      peerDiscovery: [Bootstrap, PubsubPeerDiscovery],
      pubsub: Gossipsub
    },
    config: {
      peerDiscovery: {
        [PubsubPeerDiscovery.tag]: {
          interval: 1000,
          enabled: true
        },
        [Bootstrap.tag]: {
          enabled: true,
          list: bootNodes === undefined ? bootstrapMultiAddrs : bootNodes
        }
      }
    }
  });
};

const main = async () => {
  // Create relay server
  const relay = await createRelayServer({
    listenAddresses: ["/ip4/0.0.0.0/tcp/0"]
  });
  console.log(`libp2p relay starting with id: ${relay.peerId.toB58String()}`);
  await relay.start();

  // Create the node
  const libp2p = await createBootstrapNode(bootstrapMultiaddrs);

  // Add chat handler
  libp2p.handle(ChatProtocol.PROTOCOL, ChatProtocol.handler);

  // Set up our input handler
  process.stdin.on("data", message => {
    // remove the newline
    message = message.slice(0, -1);
    // Iterate over all peers, and send messages to peers we are connected to
    libp2p.peerStore.peers.forEach(async peerData => {
      // If they dont support the chat protocol, ignore
      if (!peerData.protocols.includes(ChatProtocol.PROTOCOL)) return;

      // If we're not connected, ignore
      const connection = libp2p.connectionManager.get(peerData.id);
      if (!connection) return;

      try {
        const { stream } = await connection.newStream([ChatProtocol.PROTOCOL]);
        await ChatProtocol.send(message, stream);
      } catch (err) {
        console.error(
          "Could not negotiate chat protocol stream with peer",
          err
        );
      }
    });
  });

  // Start the node
  await libp2p.start();
  console.log("Node started with addresses:");
  libp2p.transportManager.getAddrs().forEach(ma => console.log(ma.toString()));
  console.log("\nNode supports protocols:");
  libp2p.upgrader.protocols.forEach((_, p) => console.log(p));

  // print out listening addresses
  console.log("listening on addresses:");
  libp2p.multiaddrs.forEach(addr => {
    console.log(`${addr.toString()}/p2p/${libp2p.peerId.toB58String()}`);
  });

  libp2p.on("peer:discovery", function(peerId) {
    console.log("found peer: ", peerId.toB58String());
  });

  // Create the Pubsub based chat extension
  const pubsubChat = new PubsubChat(
    libp2p,
    PubsubChat.TOPIC,
    ({ from, message }) => {
      let fromMe = from === libp2p.peerId.toB58String();
      let user = from.substring(0, 6);
      if (pubsubChat.userHandles.has(from)) {
        user = pubsubChat.userHandles.get(from);
      }
      console.info(
        `${fromMe ? PubsubChat.CLEARLINE : ""}${user}(${new Date(
          message.created
        ).toLocaleTimeString()}): ${message.data}`
      );
    }
  );

  // Set up our input handler
  process.stdin.on("data", async message => {
    // Remove trailing newline
    message = message.slice(0, -1);
    // If there was a command, exit early
    if (pubsubChat.checkCommand(message)) return;

    try {
      // Publish the message
      // await pubsubChat.send(message)
    } catch (err) {
      console.error("Could not publish chat", err);
    }
  });

  // Publish a new message each second
  setInterval(async () => {
    const ids = Array.from(pubsubChat.connectedPeers).concat(
      `${libp2p.peerId.toB58String()}`
    );
    console.log(ids.sort());
  }, 3000);
};
main();
