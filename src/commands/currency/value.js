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
      description: "You can see server currency conversion with dabby",
      usage: "see conversion amount to diffrent currency",
      guildOnly: true,
      cooldown: 5,
      aliases: ["value", "val"],
    });
  }

  async run(msg, amount) {
    let db = await database();
    let user = db.collection("members");
    let currency = await getCurrency(msg.guild.id);
    let amt = parseInt(amount);
    if (!amt) {
      return replyError(msg, "Please enter a proper amount", 5000);
    }

    let serverVal = await serverValue(msg.guild, msg);
    let estimated = Math.round((amt / serverVal) * 100);
    return msg.send(
      `You will receive ${estimated} ${currency.currencyName} ${currency.currencyEmoji} for ${amt} dabs <:dabs:851218687255773194>`
    );
  }
}

module.exports = Convert;
