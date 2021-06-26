const Command = require("../../structures/Command.js");
const {
  getCurrency,
  getCurrencyBalance,
  withdrawBalance,
  getdabbal,
  paydab,
} = require("../../structures/database.js");
class PayDab extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your dab balance.",
      usage: "pay <@member> <amount>",
      guildOnly: true,
      cooldown: 5,
      aliases: ["dabtransfer", "dt", "dabpay", "dabgive", "dg"],
    });
  }

  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);
    let balance = await getdabbal(msg.author.id);
    let result = balance.points;

    if (member.id === msg.author.id) {
      return msg.send(" Why would you pay yourself?");
    }
    if (member.user.bot) {
      return msg.send(" You can't pay bots.");
    }
    if (amount > parseInt(result)) {
      return msg.send(" You can't pay more than what you have!");
    }
    if (amount < 1) {
      return msg.send(" Why would you pay nothing?");
    }

    await member.syncSettings();
    try {
      console.log(amount);
      await paydab(msg.author.id, member.id, amount);
      /*  member.givePoints(amount);
      msg.member.takePoints(amount); */
    } catch (err) {
      return msg.send(
        `Unable to pay to **${member.displayName}** is not registered member of dabby \n or you don't have enough <:dabs:851218687255773194> use dab reswap <amount> to convert your dabs`
      );
    }

    return msg.send(
      `**${
        msg.author.username
      } |**Paid <:dabs:851218687255773194> **${amount.toLocaleString()}** dabs to **${
        member.displayName
      }**`
    );
  }
}

module.exports = PayDab;
