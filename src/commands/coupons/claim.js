const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const { generateCoupons, claimCode } = require("../../structures/database");
const serverValue = require("../../structures/servervalue.js");
class Claim extends Command {
  constructor(...args) {
    super(...args, {
      description: "Claim a coupon",
      usage: "claim <id>",
      guildOnly: true,
      cooldown: 15,
      aliases: ["claim", "cl", "redeem", "rd"],
    });
  }

  async run(msg, code) {
    let db = this.client.dbClient;

    db = await db.db();
    if (!code) {
      replyError(
        msg,
        "**🚫 | " + msg.author.username + "**, Please enter proper code",
        5000
      );
      return;
    }
    let c = await claimCode(code[0], msg.author.id, db);
    //console.log(c, code[0]);
    if (c) {
      msg.member.givePoints(c.amount);
      return msg.send(
        `**${
          msg.author.username
        } |** You have successfully claimed **${toFancyNum(
          c.amount
        )}** <:dabs:851218687255773194> coupon!`
      );
    } else {
      return msg.send(`**${msg.author.username} |** Wrong Coupon code !`);
    }
  }
}

module.exports = Claim;
