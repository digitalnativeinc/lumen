import "source-map-support/register";
import { EventManager } from "@digitalnative/lumen-events";


class LumenConfig {
  [key: string]: any;


  constructor(
  ) {
    const eventsOptions = this.eventManagerOptions(this);
    this.events = new EventManager(eventsOptions);
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
