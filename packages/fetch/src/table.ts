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

export default {
  table,
  Sources,
  sources,
};
