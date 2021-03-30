import LumenConfig from "@digitalnative/lumen-config";
import fetchData from "@digitalnative/lumen-fetch";
import submitData from "@digitalnative/lumen-submit";

const runClient = () => {
  const cron = require("node-cron");
  const config = LumenConfig.default();
  const { events } = config;
  events.emit("client:start");
  // register cron job to execute in every minute
  cron.schedule("*/10 * * * * *", async function() {
    console.log("running a task every 10 seconds");
    // fetch data
    const data = await fetchData(false, config);
    console.log(data);
    //const result = await submitData(false, config);
  });
  events.emit("client:init");
};

export default runClient;
