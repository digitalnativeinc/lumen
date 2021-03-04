onst cron = require('node-cron');
const express = require('express');
const fs = require('fs');
const shell = require('shelljs');

app = express();

require('dotenv').config();

cron.schedule('* * * * *', function() {
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
//--------------------------------------------------//

//nomica
//--------------------------------------------------//
 require('axios')
    .get("https://api.nomics.com/v1/currencies/ticker?key=" + process.env.nomica + "&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR&per-page=100&page=1")
    .then(response => console.log(response))
//--------------------------------------------------//

});
// after, maker function
