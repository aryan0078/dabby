const Command = require("../../structures/Command.js");
const { database } = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");

class SetCurrency extends Command {
  constructor(...args) {
    super(...args, {
      description: "Set currency for server",
      aliases: ["setcurrency", "setc", "stc"],
      userPermissions: ["ADMINISTRATOR"],
      usage: "stc <currencyname> <currencyeomji>",
      guildOnly: true,
      cooldown: 5,
    });
  }

  async run(msg, params) {
    if (params.length < 1) {
      replyError(
        msg,
        "Please provide necessary arguments usage: dab stc <currencyname> <emojiID>",
        5000
      );
      return;
    }
    let currencyName = params[0];
    let emojiID = params[1];
    if (currencyName == "" || currencyName == null) {
      return replyError(msg, "Please enter a proper currency name", 5000);
    }
    if (emojiID == "" || emojiID == null) {
      return replyError(msg, "Please enter a proper currency name", 5000);
    }
    if (
      currencyName == "dabs" ||
      currencyName == "dabby" ||
      currencyName == "dab"
    ) {
      return replyError(msg, "You are not allowed to set this name", 5000);
    }
    if (emojiID == "<:dabs:851218687255773194>") {
      return replyError(
        msg,
        "You are not allowed to set this currency emoji",
        5000
      );
    }
let db = this.client.dbClient;
db = await db.db();
let server = db.collection("guilds");
    let checkexist = await server.findOne({ id: msg.guild.id });
    if (!checkexist) {
      await server.insertOne({
        id: msg.guild.id,

        currencyEmoji: emojiID,
        currencyName: currencyName + " coins",
        cryptoEnabled: true,
      });
      msg.send("Successfully updated the currency settings");
      return;
    }
    if (checkexist.cryptoEnabled) {
      await server.findOneAndUpdate(
        { id: msg.guild.id },
        {
          $set: {
            currencyEmoji: emojiID,
            currencyName: currencyName + " coins",
            cryptoEnabled: true,
          },
        }
      );
      msg.send("Successfully updated the currency settings");
      return;
    }
    await server.findOneAndUpdate(
      { id: msg.guild.id },
      {
        $set: {
          currencyEmoji: emojiID,
          currencyName: currencyName + " coins",
          cryptoEnabled: true,
        },
      }
    );
    msg.send("Successfully updated the currency settings");
  }
}

module.exports = SetCurrency;
