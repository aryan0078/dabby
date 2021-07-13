const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const {
  getCurrency,
  database,
  getBalanceExists,
  getCurrencyBalance,
} = require("../../structures/database.js");
const serverValue = require("../../structures/servervalue.js");

class Reswap extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reswap you currency to dabs",
      usage: "reswap amount ",
      guildOnly: true,
      cooldown: 5,
      aliases: ["reswap", "rs", "reswap"],
    });
  }

  async run(msg, amount) {
    let db = this.client.dbClient;
    db = await db.db();
  
    let result = await getCurrencyBalance(msg.author.id, msg.guild.id, db);
    if (!result) {
      return replyError(
        msg,
        "You dont hold this server currency use `dab convert {amount}` to convert currency",
        5000
      );
    }
    if (amount == "all") {
      amount = result.amount > 80000 ? 80000 : result.amount;
    }
    let amt = parseInt(amount);
    if (!amt) {
      replyError(
        msg,
        "**🚫 | " + msg.author.username + "**, Please enter proper amount",
        5000
      );
      return;
    }
    if (result.amount < amt) {
      replyError(
        msg,
        "**🚫 | " +
          msg.author.username +
        `** , You don't have enough ${result.currencyName}!`,
        5000
      );
      return;
    }

    let user = db.collection("members");

    let serverVal = await serverValue(msg.guild, msg);
    let estimated = Math.round((amt * serverVal) / 100);
    let currencyExsis = await getBalanceExists(msg.author.id, msg.guild.id,  db);
    if (currencyExsis) {
      user.findOneAndUpdate(
        { id: msg.author.id, "wallet.id": msg.guild.id },
        {
          $set: {
            "wallet.$.amount": result.amount - amt,
          },
        }
      );
      msg.member.givePoints(estimated);
      msg.send(
        `${await this.badge(msg)} **| ${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''} |** Successfully reswapped ${
          result.currencyEmoji
        }  **${toFancyNum(amt)} ${
          result.currencyName
        }** to <:dabs:851218687255773194> **${toFancyNum(estimated)}  dabs**`
      );
      return;
    }
  }
}

module.exports = Reswap;
