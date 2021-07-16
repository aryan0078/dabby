const Command = require("../../structures/Command.js");
const {
  getdabbal,
  paydab,
  verifyUser,
  transactionLog,
} = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");
class PayDab extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your dab balance.",
      usage: "pay <@member> <amount>",
      guildOnly: true,
      cooldown: 5,
      aliases: ["pay", "give", "dabpay", "dabgive", "give", "donate", "send"],
    });
  }

  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    if (!amount) {
      return replyError(msg, "You don't have enough dabs ");
    }
    amount = this.verifyInt(amount);
    let db = this.client.dbClient;
    db = await db.db();
    let balance = await getdabbal(msg.author.id, db);
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
    let validation = await verifyUser(member.id, db);
    if (!validation) {
      return replyError(
        msg,
        "The user you are trying to pay is not a member dabby tell him to use \n**dab cash** \nIn order to receive cash ",
        10000
      );
    }
    await member.syncSettings();
    try {
      // await paydab(msg.author.id, member.id, amount, msg.guild.id, db);
      member.givePoints(amount);
      msg.member.takePoints(amount);
      await transactionLog(amount, msg.author.id, member.id, msg.guild.id, db);
    } catch (err) {
      return msg.send(
        `Unable to pay to **${member.displayName}** is not registered member of dabby \n or you don't have enough <:dabs:851218687255773194> use dab reswap <amount> to convert your dabs`
      );
    }

    return msg.send(
      `**${msg.author.username
      } ${await this.beta(msg) ? this.betaemoji : ''} |**Paid <:dabs:851218687255773194> **${amount.toLocaleString()}** dabs to **${member.displayName
      }**`
    );
  }
}

module.exports = PayDab;
