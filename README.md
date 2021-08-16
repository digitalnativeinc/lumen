# Lumen 🔅
<br>
<p align="center">

<img src="https://raw.githubusercontent.com/digitalnativeinc/lumen/main/media/lumen.png" width="800">
<br><br>


<p align="center"><strong>
** 🚨 Lumen is now currently in Beta version. Completed version is not ready yet. use it with your own caution. **</strong>
</p>

## Features

- Brings stocks, commodity, crypto or other external assets' price outside blockchain
- Submits price data to the blockchain that integrates Standard's oracle module
- Configures account to send tx to blockchains or address with configuration file

## Installation

Grab the latest version of [NPM](https://www.npmjs.com/package/@digitalnativeinc/houston):

```sh
npm install -g @digitalnativeinc/lumen
```

Configure `lumen-config.json` 

```json
{
    "nomics": "<Nomics API Key>",
    "finnhub": "<Finnhub API Key>",
    "mnemonic": "<Mnemonic to generate an account>",
    "rpc": "<RPC endpoint address or domain>"
}
```
Then run command with the file in the current working directory:
```bash
lumen run
```

## Packages

Lumen is a monorepo project which consists of packages for independent functions.

## `config`

Configuration parser should parse a js file with
- api keys to fetch 
- polkadot account json file directory to submit data 
- RPC endpoint address to connect to the blockchain 

## `Core`

Entry point of the software orchestrating other packages

## `fetch`

fetching toolkit for external assets

This package manages data table to fetch from external sources and returns price table.

## `submit`

This package manages a function which takes data table from `fetch` packages as an argument submits the data with polkadot-js account parsed from config file
The algorithm goes like:
1. checks whether the client is the current oracle provider for a given era
2. submits price data with the asset id allocated in the data table, and checks whether the data is successfully submitted.

## `events`

This packages is an event system which is included in the `config` package. One can easily emit event from importing configuration file. 

```js
  import LumenConfig from "@digitalnative/lumen-config";
  const config = LumenConfig.default();
  const { events } = config;
  events.emit("client:start");
```

events can be added in the `events/defaultSubscribers` directory. 

## `error`

specifying errors in lumen 

## `discord`

Discord integration for the oracle client

## `p2p`

A libp2p network client framework for layer2 computation