import mockUp from "./mock";
import LumenConfig from "@digitalnative/lumen-config";
import axios from "axios";
import padTokenInput from "./decimals";

/// Table for locating asset_id in STND with the ticker
/// Initial dataset are from https://wsb.gold/ top 10 ticker mentions list
/// Prices are represented in 15 decimals (e.g. one = 1e15)
const table = {
  0: "STND", // Governance token
  1: "MTR", // Stablecoin
  2: "AMC",
  3: "APHA",
  4: "TLRY",
  5: "SPY",
  6: "SNDL",
  7: "BB",
  8: "TWTR",
  9: "PLTR",
};

enum Sources {
  UNISWAP,
  PANCAKESWAP,
  BINANCE,
  HUOBI,
  FINNHUB,
  NOMICS,
  MISC,
}

const sources = {
  0: Sources.UNISWAP, // Governance token
  1: Sources.MISC, // Stablecoin TODO: wait until we list stablecoin on exchanges
  2: Sources.FINNHUB,
  3: Sources.FINNHUB,
  4: Sources.FINNHUB,
  5: Sources.FINNHUB,
  6: Sources.FINNHUB,
  7: Sources.FINNHUB,
  8: Sources.FINNHUB,
  9: Sources.FINNHUB,
};

const fetchStockData = async (symbol, config) => {
  try {
    config.events.emit("fetch:start", { symbol });
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.finnhub}`
    );
    const price = data.c;
    config.events.emit("fetch:succeed", { symbol, price });
    return padTokenInput(String(price), 15);
  } catch (err) {
    console.log(err);
    const why = `failed to fetch stock data on: ${symbol}\nstatus: ${err.response &&
      err.response.status}\nmessage: ${err.response && err.response.message}`;
    config.events.emit("fetch:fail", { why });
  }
};

const fetchNomicsData = async (symbol, config) => {
  try {
    config.events.emit("fetch:start", { symbol });
    const { data } = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=${
        config.nomics
      }&ids=${symbol}&intervdal=1d,30d&convert=USD&per-page=100&page=1&sort=rank`
    );
    const price = data[0].price;
    config.events.emit("fetch:succeed", { symbol, price });
    return padTokenInput(price, 15);
  } catch (err) {
    const why = `failed to fetch coin data on :${symbol}\nstatus: ${err.response &&
      err.response.status}\nmessage: ${err.response && err.response.message}`;
    config.events.emit("fetch:fail", { why });
  }
};

const fetchData = async (isMock: boolean, config: LumenConfig) => {
  // Check mock option
  if (isMock) {
    return mockUp;
  } else {
    // Get assets to fetch prices
    const data = {};
    // traverse from the table dict and get price for each
    for (const [key, value] of Object.entries(table)) {
      const result = await (async () => {
        switch (sources[key]) {
          // finnhub for stocks
          case Sources.FINNHUB:
            return await fetchStockData(value, config);
          // nomics for crypto
          case Sources.NOMICS:
            return await fetchNomicsData(value, config);
          default:
            return (1e15).toString();
        }
      })();
      data[key] = result;
    }

    return data;
  }
};

export default fetchData;
