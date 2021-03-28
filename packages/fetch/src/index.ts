import table from "./table";
import mockUp from "./mock";
import LumenConfig from "@digitalnative/lumen-config";

const fetchData = (isMock: boolean, config: LumenConfig) => {
  // Check mock option
  if (isMock) {
    return mockUp;
  } else {
    // fetch datas from data table
    // traverse from the table dict and get price for each
    const finnhub = require("finnhub");
    const api_key = finnhub.ApiClient.instance.authentications["api_key"];
    api_key.apiKey = config.finnhub; // Replace this
    const finnhubClient = new finnhub.DefaultApi();

    // nomics for crypto

    // finnhub for stocks

    return data;
  }
};

export default fetch;
