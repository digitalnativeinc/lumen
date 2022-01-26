import LumenConfig from "@digitalnative/lumen-config";
import fetchData from "@digitalnative/lumen-fetch";
import submitData from "@digitalnative/lumen-submit";
import { ApiPromise, WsProvider } from "@polkadot/api";
import "./abis";
import { Contract, ethers } from "ethers";
import { vaultFactoryABI } from "./abis/vaultFactory";
import { vaultManagerABI } from "./abis/vaultManager";
import { erc20ABI } from "./abis/erc20";

const runHunter = async (dir) => {
  const cron = require("node-cron");
  const config = LumenConfig.default({ dir });
  const { events } = config;
  events.emit("hunt:start");
  const api = await ethersApi(config);
  // register cron job to execute in every minute
  cron.schedule("*/1 * * * * *", async function() {
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
  const vault = new Contract("0x0", vaultABI, api);
  const erc20 = new Contract("0x0", erc20ABI, api);
  // get total number of vaults
  const vaults = await vaultFactory.allVaultsLength().toNumber();
  const vaultManagerAddr = await vaultFactory.manager();
  const vaultManager = new Contract(vaultManagerAddr, vaultManagerABI, api);
  events.emit("hunt:scan", { vaults });
  // investigate each
  for (let i = 0; i <= vaults; i++) {
    // get vault address from factory
    let vaultAddr = await vaultFactory.getVault(i);
    // get info from vault
    let collateral = await vault.attach(vaultAddr).collateral();
    let debt = await vault.attach(vaultAddr).debt();
    // get settings from vault manager
    const [mcr, lfr, sfr, on] = await vaultManager.getCDPConfig(collateral);
    console.log(` MCR: ${mcr}% \n LFR: ${lfr}% \n SFR: ${sfr}% \n on: ${on}`);
    // get each amount stored in the cdp
    let cAmount = await erc20.attach(collateral).balanceOf(vaultAddr);
    let dAmount = await erc20.attach(debt).balanceOf(vaultAddr);
    // get whether the position is valid
    let isValidCDP = await vaultManager.isValidCDP(
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
        let liquidate = await vault.attach(vaultAddr).liquidate();
        events.emit("hunt:liquidate");
        await liquidate.wait();
        events.emit("hunt:liquidateSuccess", {});
      } catch (e) {
        events.emit("hunt:fail", { e });
      }
    }
  }
}
