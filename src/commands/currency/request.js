const Command = require("../../structures/Command.js");
const {
  getCurrency,
  getCurrencyBalance,
  withdrawBalance,
} = require("../../structures/database.js");
class Request extends Command {
  constructor(...args) {
    super(...args, {
      description: "Request for some currency",
      cooldown: 5,
      usage: "request <@member> <amount>",
      guildOnly: true,
      aliases: ["request", "req", "beg"],
    });
  }

  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);

    let db = this.client.dbClient;
    db = await db.db();

    let dabs = await getCurrency(msg.guild.id, db);

    if (member.id === msg.author.id)
      return msg.send(" Why would you request yourself?");
    if (member.user.bot) return msg.send(" You can't request bots.");
    if (amount > parseInt(50000000))
      return msg.send(" You can't request that much!");
    if (amount < 1) return msg.send("You can't request that amount");
    if (amount > Number.MAX_SAFE_INTEGER)
      return msg.send(" That amount is too high!");

    await member.syncSettings();

    return msg.send(
      `**${msg.author.username} |** Requested **${amount.toLocaleString()}** ${
        dabs.currencyName
      } ${dabs.currencyEmoji} from **${member.displayName}**`
    );
  }
}

module.exports = Request;
