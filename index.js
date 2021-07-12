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
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
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
    let balance = await getdabbal(button.clicker.user.id, l);
    let result = balance.points;
    if (result < parseInt(u[2])) {
      return button.message.send(
        `You don't have enough <:dabs:851218687255773194> dabs to pay fill your wallet and then pay`
      );
    } else {
      await paydab(button.clicker.user.id, u[3], parseInt(u[2]), "DM", l);
      button.message.send(
        `Sent **${toFancyNum(
          parseInt(u[2])
        )}** <:dabs:851218687255773194> dabs to **${u[3]}** `
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
  }
   if (args.startsWith("reject")) {
     let u = args.split(":");

     button.message.send(
       `Payment rejected of **${toFancyNum(
         parseInt(u[2])
       )}** <:dabs:851218687255773194> dabs to **<@${u[3]}>** `
     );
     button.message.delete();
     try {
       let user = await d.users.fetch(u[3]);
       user.send(
         `**${user.username} |** Payment Rejected from ${
           button.clicker.user.username
         } of **${toFancyNum(parseInt(u[2]))}** <:dabs:851218687255773194> dabs`
       );
     } catch (e) {
       console.log("");
     }
     await button.defer();
   }
   
});
