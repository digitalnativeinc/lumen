import LumenConfig from "@digitalnative/lumen-config";


require('dotenv').config();



const runClient = () => {
  const cron = require('node-cron');
  const config = LumenConfig.default();
  const { events } = config;
  events.emit("client:start");
  // register cron job to execute in every minute
  cron.schedule('* * * * *', tasks);
  events.emit("client:init");
}

function tasks() {
  // Fetch

  
  // Submit
  
  
  //finnhub
  //--------------------------------------------------//
  const finnhub = require('finnhub');
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey = process.env.finnhub // Replace this
  const finnhubClient = new finnhub.DefaultApi()
  
  // Crypto candles
  finnhubClient.cryptoCandles("BINANCE:BTCUSDT", "D", 1590988249, 1591852249, (error, data, response) => {
    console.log(data)
  });
  
  // Crypto exchanges
  finnhubClient.cryptoExchanges((error, data, response) => {
      console.log(data)
  });
  
  //Crypto symbols
  finnhubClient.cryptoSymbols("BINANCE", (error, data, response) => {
      console.log(data)
  });
}

export default runClient;