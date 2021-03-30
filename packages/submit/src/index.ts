import LumenConfig from "@digitalnative/lumen-config";
import { Keyring } from "@polkadot/keyring";
import { ApiPromise, WsProvider } from "@polkadot/api";

const submitData = async (
  data: { [key: string]: string },
  config: LumenConfig
) => {
  // Generate keyring from mnemonics in config file
  // create a keyring with some non-default values specified
  console.log(data);
  const keyring = new Keyring();
  const pair = keyring.addFromUri(
    config.mnemonic,
    { name: "oracle pair" },
    "sr25519"
  );
  // Construct
  const wsProvider = new WsProvider(config.rpc);
  const api = await ApiPromise.create({ provider: wsProvider });
  // traverse from the data dict and submit each price
  for (const [key, value] of Object.entries(data)) {
    const unsub = await api.tx.oracle
      .submit(parseInt(key), parseInt(value))
      .signAndSend(pair, (result) => {
        console.log(`Current status is ${result.status}`);

        if (result.status.isInBlock) {
          console.log(
            `Transaction included at blockHash ${result.status.asInBlock}`
          );
        } else if (result.status.isFinalized) {
          console.log(
            `Transaction finalized at blockHash ${result.status.asFinalized}`
          );
          unsub();
        }
      });
  }
};

export default submitData;
