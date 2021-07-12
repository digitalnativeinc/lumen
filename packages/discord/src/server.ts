import Discord, { Message } from 'discord.js';
import { CommandHandler } from './command_handler';
import { BotConfig, config } from './config/config';

/** Pre-startup validation of the client config. */
function validateConfig(clientConf: BotConfig) {
  if (!clientConf.token) {
    throw new Error('You need to specify your Discord client token!');
  }
}

validateConfig(config);

const commandHandler = new CommandHandler(config.prefix);

const client = new Discord.Client();


client.on('ready', () => {
  console.log('client has started');
  client.user?.setUsername("Lumen-Dgt-stnd")
  client.user?.setPresence({
    status: "online",  //You can show online, idle....
  });
  client.user?.setActivity("$0.36", {type: 'WATCHING'})
});

client.on('message', (message: Message) => {
  commandHandler.handleMessage(message);
});

client.on('error', (e) => {
  console.error('Discord client error!', e);
  client.user?.setPresence({
    status: "dnd",  //You can show online, idle....
  });
});

client.login(config.token);

export default client
