const Command = require("../../structures/Command.js");
const {
  getCurrency,
  getCurrencyBalance,
  withdrawBalance,
  getdabbal,
  paydab,
} = require("../../structures/database.js");
class setBal extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your dab balance.",
      usage: "pay <@member> <amount>",
      guildOnly: true,
      ownerOnly: true,
      aliases: ["setbal", "stb"],
    });
  }

  async run(msg, [member]) {
    member = await this.verifyMember(msg, member);

    let db = this.client.dbClient;
    db = await db.db();

    let users = db.collection("transactions");
    let user1bal = await users.find({ by: member.id });
    let log = "Transaction Logs\n";
    user1bal.forEach((transaction) => {
      log += `from : ${transaction.by} to : ${transaction.to} of : ${
        transaction.amount
      } at ${new Date(transaction.at)} `;
    });
    msg.send(log);
  }
}

module.exports = setBal;
