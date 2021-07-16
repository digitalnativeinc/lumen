import "source-map-support/register";
import { EventManager } from "@digitalnative/lumen-events";
const prompt = require("prompt");
import { mnemonicGenerate } from "@polkadot/util-crypto";
const fs = require("fs");

const properties = [
  {
    name: "nomics",
    validator: /^[a-zA-Z\s\-]+$/,
    warning: "API key must be only letters, spaces, or dashes",
  },
  {
    name: "finnhub",
    validator: /^[a-zA-Z\s\-]+$/,
    warning: "API key must be only letters, spaces, or dashes",
  },
];

function onErr(err) {
  console.log(err);
  return 1;
}

class LumenConfig {
  [key: string]: any;

  constructor() {
    const eventsOptions = this.eventManagerOptions(this);
    this.events = new EventManager(eventsOptions);

    try {
      if (fs.existsSync("./lumen-config.json")) {
        //file exists
        // load config file
        const config = JSON.parse(
          fs.readFileSync("./lumen-config.json", "utf8")
        );
        this.nomics = config.nomics;
        this.finnhub = config.finnhub;
        this.mnemonic = config.mnemonic;
        this.rpc = config.rpc;
      } else {
        console.log("Configuration file not found");
        // if config file is not found, make it with prompt
        prompt.start();

        prompt.get(properties, function(err, result) {
          if (err) {
            return onErr(err);
          }
          this.nomics = result.nomics;
          this.finnhub = result.finnhub;
          this.mnemonic = mnemonicGenerate();
          console.log("Configuration is generated:");
          console.log("  Nomics API Key: " + result.nomics);
          console.log("  Finncdhub API Key: " + result.finnhub);
          console.log("  Mnemonic: " + this.mnemonic);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  public eventManagerOptions(config: LumenConfig): any {
    let muteLogging;
    const { quiet, logger, subscribers } = config;

    if (quiet) muteLogging = true;
    return { logger, muteLogging, subscribers };
  }

  public static default(): LumenConfig {
    return new LumenConfig();
  }
}

export default LumenConfig;
