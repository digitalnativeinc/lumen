import LumenConfig from "@digitalnative/lumen-config";
import { Contract, ethers, Wallet } from "ethers";
import { ApiPromise, WsProvider } from "@polkadot/api";


export async function ethersApi(config: LumenConfig) {
    let provider = new ethers.providers.JsonRpcProvider(config.ethProvider);
    let walletWithProvider = new Wallet(config.private, provider);
    return walletWithProvider;
  }
  
export async function polkadotApi(config: LumenConfig) {
    const provider = new WsProvider(config.rpc);
    const definitions = require("@digitalnative/type-definitions/opportunity");
    let types = definitions.types[0].types;
    const api = await new ApiPromise({
      provider,
      types,
    });
    await api.isReady;
    return api;
  }