# P2P

An encrypted js-libp2p client with bootstrap discovery method with relayer server


# Config

`bootNodes` : array of bootnodes' libp2p multiaddresses to receive other connected node informations 


Include bootnode or current connected p2p clients' multiaddress array in `lumen-config.json` file

```json
{
    "bootNodes": ["/ip4/127.0.0.1/tcp/45227/p2p/QmZRjNvMG7Cg59chHvv463bFSbB4q8BhpQLKunkcswiWMo", "/ip4/127.0.0.1/tcp/39985/p2p/QmXjV9sSBoAD7vySJSmFrAHy84qf8QTYnup6jMUj9ne3NL", "/ip4/127.0.0.1/tcp/34823/p2p/Qmc5ZBQfoxWALznRshJteMiw5zikhnHXDuy5RQcLLGHEKS"]
}
```

Then, the client will locate to bootnodes to receive other peers info on start.