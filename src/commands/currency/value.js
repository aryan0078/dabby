const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const { getCurrency } = require("../../structures/database.js");
const serverValue = require("../../structures/servervalue.js");
class Convert extends Command {
  constructor(...args) {
    super(...args, {
      description: "You can see server currency conversion with dabby",
      usage: "see conversion amount to diffrent currency",
      guildOnly: true,
      cooldown: 5,
      aliases: ["value", "val"],
    });
  }

  async run(msg, amount) {
    let db = this.client.dbClient;
    db = await db.db();
    let currency = await getCurrency(msg.guild.id, db);
    let amt = parseInt(amount);
    if (!amt) {
      return replyError(msg, "Please enter a proper amount", 5000);
    }

    let serverVal = await serverValue(msg.guild, msg);
    let estimated = Math.round((amt / serverVal) * 100);
    return msg.send(
      `${await this.badge(msg)} **| ${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''} |** You will receive **${estimated} ${currency.currencyEmoji}** ${currency.currencyName}  for **${amt} dabs** <:dabs:851218687255773194>`
    );
  }
}

module.exports = Convert;
