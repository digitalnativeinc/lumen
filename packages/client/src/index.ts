import LumenConfig from "@digitalnative/lumen-config";


require('dotenv').config();



const runClient = () => {
  const cron = require('node-cron');
  const config = LumenConfig.default();
  const { events } = config;
  events.emit("client:start");
  // register cron job to execute in every minute
  cron.schedule('* * * * *', function() {
    console.log('running a task every minute');
  });
  events.emit("client:init");
}


export default runClient;