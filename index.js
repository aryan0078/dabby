/**
 * Entry file.
 * Try to keep this file minimum and abstract most of the functionality in seperate files.
 *
 * @author Raven
 * @license MIT
 */

// Load .env
require("dotenv").config();

// Setup Module Alias.
const moduleAlias = require("module-alias");
const { paydab, getdabbal } = require("./src/structures/database.js");
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const port = 3000;

server.listen(port, () => {
  console.log("Socket started");
});
moduleAlias.addAliases({
  "@utils": __dirname + "/src/utils",
  "@structures": __dirname + "/src/structures",
  "@json": __dirname + "/assets/json",
  "@languages": __dirname + "/src/languages",
});

// Load discord.js extensions.
require("./src/extensions/GuildMember.js");
require("./src/extensions/TextChannel.js");
require("./src/extensions/DMChannel.js");
require("./src/extensions/Message.js");
require("./src/extensions/Guild.js");
require("./src/extensions/User.js");

// Import the Client.
const DabbyClient = require("./src/structures/DabbyClient.js");
const { toFancyNum } = require("./src/utils/constants.js");

// Login. (And start in development mode if --dev is passed)
let d = new DabbyClient(process.argv.includes("--dev"));
d.login();














