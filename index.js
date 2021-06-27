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
const { paydab } = require("./src/structures/database.js");

moduleAlias.addAliases({
  "@utils":      __dirname + "/src/utils",
  "@structures": __dirname + "/src/structures",
  "@json":       __dirname + "/assets/json",
  "@languages":  __dirname + "/src/languages"
});

// Load discord.js extensions.
require("./src/extensions/GuildMember.js");
require("./src/extensions/TextChannel.js");
require("./src/extensions/DMChannel.js");
require("./src/extensions/Message.js");
require("./src/extensions/Guild.js");
require("./src/extensions/User.js");

// Import the Client.
const MiyakoClient = require("./src/structures/MiyakoClient.js");
const { toFancyNum } = require("./src/utils/constants.js");

// Login. (And start in development mode if --dev is passed)
let d = new MiyakoClient(process.argv.includes("--dev"));
d.login();
require("discord-buttons")(d);
d.on("clickButton", async (button) => {
  let l = d.dbClient;
  l = l.db();
  let args = button.id;
  if (args.startsWith("accept")) {
    let u = args.split(":");
    try {
      await paydab(button.clicker.user.id, u[1], parseInt(u[2]), l);
    } catch {
      return button.message.send(
        `You don't have enough <:dabs:851218687255773194> dabs to pay fill your wallet and then pay`
      );
    }
    button.message.send(
      `Sent **${toFancyNum(
        parseInt(u[2])
      )}** <:dabs:851218687255773194> dabs to **<@${u[1]}>** `
    );

    button.message.delete();
    try {
      let user = await d.users.fetch(u[3]);
      user.send(
        `**${user.username} |** Payment Accepted from ${
          button.clicker.user.username
        } of **${toFancyNum(
          parseInt(u[2])
        )}** <:dabs:851218687255773194> dabs you recived the amount is wallet!`
      );
    } catch (e) {
      console.log("");
    }
    await button.defer();
  }
});
