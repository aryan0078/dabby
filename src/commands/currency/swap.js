const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const {
  getCurrency,
  database,
  getBalanceExists,
  getCurrencyBalance,
} = require("../../structures/database.js");
const serverValue = require("../../structures/servervalue.js");
class Convert extends Command {
  constructor(...args) {
    super(...args, {
      description: "Convert ",
      usage: "convert amount to diffrent currency",
      guildOnly: true,
      cooldown: 6,
      aliases: ["conv", "convert", "swap", "sw"],
    });
  }

  async run(msg, amount) {


    let db = this.client.dbClient;
    db = await db.db();
    let currency = await getCurrency(msg.guild.id, db);
    if (!amount) {
      replyError(
        msg,
        "**🚫 | " + msg.author.username + "**, Please enter proper amount",
        5000
      );
      return;
    }
    let result = msg.member.settings.points;
    if (amount == "all") {
      amount = result > 40000 ? 40000 : result;
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
    if (result < amt) {
      replyError(
        msg,
        "**🚫 | " +
          msg.author.username +
          "**, You don't have enough <:dabs:851218687255773194> dabs",

        3000
      );
      return;
    }

    let user = db.collection("members");

    let serverVal = await serverValue(msg.guild, msg);
    let estimated = Math.round((amt / serverVal) * 100);
    let currencyExsis = await getBalanceExists(msg.author.id, msg.guild.id, db);
    if (currencyExsis) {
      msg.member.takePoints(amt);
      let f = await getCurrencyBalance(msg.author.id, msg.guild.id, db);
      user.findOneAndUpdate(
        { id: msg.author.id, "wallet.id": msg.guild.id },
        {
          $set: {
            "wallet.$.amount": estimated + f.amount,
            "wallet.$.currencyEmoji": currency.currencyEmoji,
            "wallet.$.currencyName": currency.currencyName,
            "wallet.$.serverName": msg.guild.name,
          },
        }
      );

      msg.send(
        `${await this.badge(msg)} **| ${
          msg.author.username
        } ${await this.beta(msg) ? this.betaemoji : ''} |** Successfully swapped <:dabs:851218687255773194> **${toFancyNum(
          amt
        )}** dabs to ${currency.currencyEmoji} **${toFancyNum(estimated)}** ${
          currency.currencyName
        }`
      );
      return;
    }
    if (user.findOne({ id: msg.author.id })) {
      msg.member.takePoints(amt);

      user.findOneAndUpdate(
        { id: msg.author.id },
        {
          $push: {
            wallet: {
              id: msg.guild.id,
              currencyName: currency.currencyName,
              currencyEmoji: currency.currencyEmoji,
              amount: estimated,
              serverName: msg.guild.name,
            },
          },
        }
      );
      msg.send(
        `Succefully converted ${amt} dabs <:dabs:851218687255773194> to ${
          currency.currencyEmoji
        } you will get ${toFancyNum(estimated)} ${currency.currencyEmoji} ${
          currency.currencyName
        }`
      );
      return;
    } else {
      msg.member.takePoints(amt);

      user.findOneAndUpdate(
        { id: msg.author.id },
        {
          $set: {
            wallet: [
              {
                id: msg.guild.id,
                currencyName: currency.currencyName,
                currencyEmoji: currency.currencyEmoji,
                amount: estimated,
                serverName: msg.guild.name,
              },
            ],
          },
        }
      );
      msg.send(
        `Succefully converted ${amt} dabs <:dabs:851218687255773194> to ${
          currency.currencyEmoji
        } you will get ${toFancyNum(estimated)} ${currency.currencyEmoji} ${
          currency.currencyName
        }`
      );
    }
  }
}

module.exports = Convert;
