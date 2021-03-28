import table from "./table"
import mock from "./mock"


const fetch = (isMock: boolean)  => {
  // Check mock option
  if (isMock) {

  }
  else {
    // fetch datas from data table
      // traverse from the table dict and get price for each
      const finnhub = require('finnhub');
      const api_key = finnhub.ApiClient.instance.authentications['api_key'];
      api_key.apiKey = process.env.finnhub // Replace this
      const finnhubClient = new finnhub.DefaultApi()

    // nomics for crypto

    // finnhub for stocks
  }
}

export default fetch;
