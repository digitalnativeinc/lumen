const OS = require("os");

export default {
  initialization: function() {
    this.logger = console;
  },
  handlers: {
    "fetch:start": [
      function({ symbol }) {
        this.logger.log(`> fetching 📰 🐕 ${symbol}...`);
      },
    ],
    "fetch:succeed": [
      function({ symbol, price }) {
        this.logger.log(
          `> 🗞🐶 Successfully fetched the info: ${symbol} at 🗞 $${price}`
        );
      },
    ],
    "fetch:fail": [
      function({ symbol, why }) {
        this.logger.log(`> ❌🐶 Failed to fetch ${symbol}: ${OS.EOL} ${why}`);
      },
    ],
  },
};
