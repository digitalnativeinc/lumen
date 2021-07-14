import LumenConfig from "@digitalnative/lumen-config";
import { Keyring } from "@polkadot/keyring";
import { ApiPromise, WsProvider } from "@polkadot/api";
import type { RegistryTypes } from '@polkadot/types/types';
import { config } from "process";
import {definitions} from "@digitalnative/type-definitions";

const submitData = async (
  data: { [key: string]: string },
  config: LumenConfig,
  api: ApiPromise
) => {
  // Generate keyring from mnemonics in config file
  // create a keyring with some non-default values specified
  //console.log(data);
  const keyring = new Keyring();
  const pair = keyring.addFromUri(
    config.mnemonic,
    { name: "oracle pair" },
    "sr25519"
  );     
  
  for (const [key, value] of Object.entries(data)) {
      try{
        console.log(key)
        
        await report(key, value, api, pair)
      } catch (error) {
        console.error(error);
      }
  }
  /*
  // traverse from the data dict and submit each price
  for (const [key, value] of Object.entries(data)) {
    console.log(key)
    const api = await polkadotApi(config);
    await report(key, value, api, pair)
  }
  */
};

export default submitData;


const report = async(key: string, value: string, api: ApiPromise, pair: any) => {
  console.log("submitting tx")
  const unsub = await api.tx.oracle
  .report(parseInt(key), parseInt(value))
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
  await timer(6000);
}

const timer = ms => new Promise(res => setTimeout(res, ms))