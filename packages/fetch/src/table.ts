
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
    9: "PLTR"
}

export default table;