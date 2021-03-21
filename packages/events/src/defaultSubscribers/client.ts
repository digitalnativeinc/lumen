const OS = require("os");

export default {
  initialization: function() {
    this.logger = console;
  },
  handlers: {
    "client:start": [
      function() {
        this.logger.log(`${OS.EOL}> 🔍 starting the oracle client...`);
        this.logger.log(`================`);
      },
    ],
    "client:init": [
      function() {
        this.logger.log(`${OS.EOL}> 🕒 Initiated cron job to submit data from the oracle!`);
        this.logger.log(`================`);
      }
    ],
    "client:wait": [
      function() {
        this.logger.log(`${OS.EOL}> 🕔 Waiting for the next submission...`);
        this.logger.log(`================`);
      }
    ],
    "client:fetchSucceed": [
      function({assetName, price}) {
        this.logger.log(
          `${OS.EOL}> 🦴🐶 Successfully fetched info from the source: ${assetName} at 💵 ${price}`
        );
        this.logger.log(`================`);
      }
    ],
    "client:fetchFailed": [
      function({error}) {
        this.logger.log(
          `${OS.EOL}> ❌🐶 Failed to fetch info from the source: ${OS.EOL} ${error}`
        );
        this.logger.log(`================`);
      }
    ],
    "client:submitSucceed": [
      function({ assetName, price }) {
        this.logger.log(
          `${OS.EOL}> 📬 Successfully submitted info to the blockchain: ${assetName} at 💵 ${price}`
        );
      },
    ],
    "client:submitFailed": [
      function({ assetName, price, error }) {
        this.logger.log(
          `${OS.EOL}> 🤷‍♂️ Failed to submit info to the blockchain: ${assetName} at 💵 ${price}
          ${OS.EOL} ${error}`
        );
      },
    ],
    "client:fail": [
      function({ error }) {
        this.logger.log(
          `${OS.EOL} 🌪 Something went wrong while running the oracle!`
        );
        this.logger.log(`${error}${OS.EOL}`);
      },
    ],
  },
};
