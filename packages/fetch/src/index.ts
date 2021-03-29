import mockUp from "./mock";
import LumenConfig from "@digitalnative/lumen-config";
import axios from "axios";

/// Table for locating asset_id in STND with the ticker
/// Initial dataset are from https://wsb.gold/ top 10 ticker mentions list
/// Prices are represented in 15 decimals (e.g. one = 1e15)
const table = {
  0: "STND", // Governance token
  1: "MTR", // Stablecoin
  2: "AMC:-4",
  3: "APHA:-4",
  4: "TLRY:-4",
  5: "SPY:-4",
  6: "SNDL:-4",
  7: "BB:-4",
  8: "TWTR:-4",
  9: "PLTR:-4",
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
  1: Sources.MISC, // Stablecoin TODO: wait until we list stablecoin
  2: Sources.FINNHUB,
  3: Sources.FINNHUB,
  4: Sources.FINNHUB,
  5: Sources.FINNHUB,
  6: Sources.FINNHUB,
  7: Sources.FINNHUB,
  8: Sources.FINNHUB,
  9: Sources.FINNHUB,
};

const fetchStockData = async (symbol, apiKey) => {
  console.log(`fetching stock data on: ${symbol}`);
  try {
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    return data.c;
  } catch (err) {
    console.error(
      `failed to fetch stock data on: ${symbol}\nstatus: ${err.response &&
        err.response.status}\nmessage: ${err.response && err.response.message}`
    );
  }
};

const fetchCoinData = async (abbr, apiKey) => {
  console.log(`fetching coin data on: ${abbr}`);
  try {
    const { data } = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=${apiKey}&ids=${abbr}&intervdal=1d,30d&convert=USD&per-page=100&page=1&sort=rank`
    );
    console.log(`sucessfully fetched coin data: ${abbr}`);
    return data[0].price;
  } catch (err) {
    console.error(
      `failed to fetch coin data on :${abbr}\nstatus: ${err.response &&
        err.response.status}\nmessage: ${err.response && err.response.message}`
    );
  }
};

const fetchData = (isMock: boolean, config: LumenConfig) => {
  // Check mock option
  if (isMock) {
    return mockUp;
  } else {
    // Get assets to fetch prices
    const data = {};
    // traverse from the table dict and get price for each
    for (const [key, value] of Object.entries(table)) {
      const result = (async () => {
        switch (sources[key]) {
          // finnhub for stocks
          case Sources.FINNHUB:
            return await fetchStockData(value, config.finnhub);
          // nomics for crypto
          case Sources.NOMICS:
            return await fetchCoinData(value, config.nomics);
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
