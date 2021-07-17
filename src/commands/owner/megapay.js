const Command = require("../../structures/Command.js");
class MegaPay extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your dab balance.",
      usage: "pay <@member> <amount>",
      guildOnly: true,
      ownerOnly: true,
      aliases: ["megapay", "ownerpay"],
    });
  }

  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);
    let db = this.client.dbClient;
    db = await db.db();

    let users = db.collection("members");
    let user1bal = await users.findOne({ id: member.id });

    await users.findOneAndUpdate(
      { id: member.id },
      { $set: { points: user1bal.points + amount } }
    );

    return msg.send(
      `**${
        msg.author.username
      } Paid <:dabs:851218687255773194> **${amount.toLocaleString()}** dabs to **${
        member.displayName
      }**`
    );
  }
}

module.exports = MegaPay;
