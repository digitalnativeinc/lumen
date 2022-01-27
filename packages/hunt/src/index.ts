import LumenConfig from "@digitalnative/lumen-config";
import fetchData from "@digitalnative/lumen-fetch";
import submitData from "@digitalnative/lumen-submit";
import { ApiPromise, WsProvider } from "@polkadot/api";
import "./abis";
import { Contract, ethers } from "ethers";
import { vaultFactoryABI } from "./abis/vaultFactory";
import { vaultManagerABI } from "./abis/vaultManager";
import { vaultABI } from "./abis/vault";
import { erc20ABI } from "./abis/erc20";

const runHunter = async (dir) => {
  const cron = require("node-cron");
  const config = LumenConfig.default({ dir });
  const { events } = config;
  events.emit("hunt:start");
  const api = await ethersApi(config);
  // register cron job to execute in every minute
  cron.schedule("*/30 * * * * *", async function() {
    events.emit("hunt:next");
    await getVaultFactory(api, config, events);
  });
  events.emit("hunt:init");
};

export default runHunter;

async function ethersApi(config: LumenConfig) {
  let provider = new ethers.providers.JsonRpcProvider(config.ethProvider);
  let wallet = ethers.Wallet.fromMnemonic(config.mnemonic);
  let walletWithProvider = wallet.connect(provider);
  return walletWithProvider;
}

async function polkadotApi(config: LumenConfig) {
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

async function getVaultFactory(api, config: LumenConfig, events) {
  const vaultFactory = new Contract(config.factory, vaultFactoryABI, api);
  // get total number of vaults
  const vaults = await vaultFactory.allVaultsLength();
  const vaultManagerAddr = await vaultFactory.manager();
  const vaultManager = new Contract(vaultManagerAddr, vaultManagerABI, api);
  events.emit("hunt:scan", { vaults });
  const serial = Array.from({ length: vaults.toNumber() }, (v, i) => i);
  for (let i of serial) {
    try {
      await investigate(i, vaultManager, vaultFactory, api, events);
    } catch (e) {
      console.log(e);
    }
  }
  events("hunt:results");
}

async function investigate(i, vaultManager, vaultFactory, api, events) {
  // get vault address from factory
  let vaultAddr = await vaultFactory.getVault(i);
  const vault = new Contract(vaultAddr, vaultABI, api);
  // get info from vault
  let collateral = await vault.collateral();
  let debt = await vault.debt();
  const erc20_1 = new Contract(collateral, erc20ABI, api);
  let [mcr, lfr, sfr, cDecimals, on] = await vaultManager.getCDPConfig(
    collateral
  );
  let cAmount = await erc20_1.attach(collateral).balanceOf(vaultAddr);
  let dAmount = await vault.borrow();
  // get whether the position is valid
  
  const isValidCDP = await vaultManager.isValidCDP(
    collateral,
    debt,
    cAmount,
    dAmount
  );

  // emit each vault status
  events.emit("hunt:vault", {
    i,
    collateral,
    debt,
    cAmount,
    dAmount,
    mcr,
    lfr,
    sfr,
    on,
    isValidCDP,
  });

  
  // check vault health and react
  if (isValidCDP) {
    events.emit("hunt:vaultSafe");
  } else {
    events.emit("hunt:vaultFail");
    // initiate liquidation tx
    try {
      events.emit("hunt:liquidate");      
      let liquidate = await vault.liquidate();
      await liquidate.wait();
      events.emit("hunt:liquidateSuccess", {});
    } catch (e) {
      events.emit("hunt:fail", { e });
    }   
  }
}
