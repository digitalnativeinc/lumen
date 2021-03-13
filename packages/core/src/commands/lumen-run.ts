#!/usr/bin/env node
const commander = require("commander");
const program = new commander.Command();
import runClient from "@digitalnative/lumen-client";

program
  .command("<name> [options]")
  .name("init")
  .usage("[options]")
  .option("--force <dir>", "overwrite forcefully in the directory")
  .description("create a Houston project")
  .action(runClient)
  .parse(process.argv);
