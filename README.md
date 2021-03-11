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

Configure `lumen-config.json` then run command:

```bash
lumen run ./lumen-config.json
```

oracle will run to

## Packages

Lumen is a monorepo project which consists of packages for independent functions.

# `config`

Configuration parser

# `Core`

Entry point of the software orchestrating other packages

# `fetch`

fetching toolkit for external assets

# `feed`

feeding interface to blockchains

# `events`

event handler to show status of an oracle

# `error`

specifying errors in lumen 
