import LumenConfig from "@digitalnative/lumen-config";
import fetchData from "@digitalnative/lumen-fetch";
import submitData from "@digitalnative/lumen-submit";
import { ApiPromise, WsProvider } from "@polkadot/api";

const runClient = async () => {
  const cron = require("node-cron");
  const config = LumenConfig.default();
  const { events } = config;
  events.emit("client:start");
  const api = await polkadotApi(config);
  // register cron job to execute in every minute
  cron.schedule("*/90 * * * * *", async function() {
    console.log("running a task every 2 minutes");
    // fetch data
    const data = await fetchData(false, config);
    await submitData(data, config, api);
  });
  events.emit("client:init");
};

export default runClient;

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
