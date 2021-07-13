const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const { generateCoupons } = require("../../structures/database");
const serverValue = require("../../structures/servervalue.js");
class GenerateCoupons extends Command {
  constructor(...args) {
    super(...args, {
      description: "Generate a coupon",
      usage: "generate {amount}",
      guildOnly: true,
      cooldown: 50,
      aliases: ["gen", "generate", "gendab", "gdabs", "gdab", "gcoupon", "gc"],
    });
  }

  async run(msg, amount) {
    let amt = parseInt(amount);
    let db = this.client.dbClient;

    db = await db.db();
    if (!amount) {
      replyError(
        msg,
        "**🚫 | " + msg.author.username + "**, Please enter proper amount",
        5000
      );
      return;
    }
    let result = msg.member.settings.points;
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

    msg.member.takePoints(amt);
    let code = await generateCoupons(amt, msg.author.id, db);
    let u = await this.verifyUser(msg, msg.author);

    try {
      msg.send(
        `${await this.badge(msg)} **| ${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}|** You have Successfully generated **${amount}** <:dabs:851218687255773194> redeem code \n check your DM for code`
      );
      u.send(
        `>>> You code to claim **${amount}** dabs <:dabs:851218687255773194> use **dab claim {code}** to claim`
      );
      u.send(`**${code}**`);
    } catch (err) {
      msg.member.givePoints(amt);
      return msg.send(
        `>>> Your dm is off code generation failed open your dm to get code your <:dabs:851218687255773194> is returned to your wallet`
      );
    }
  }
}

module.exports = GenerateCoupons;
