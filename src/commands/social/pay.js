const Command = require("../../structures/Command.js");
const {
  getCurrency,
  getCurrencyBalance,
  withdrawBalance,
} = require("../../structures/database.js");
class Pay extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pay someone from your balance.",
      cooldown: 5,
      usage: "pay <@member> <amount>",
      guildOnly: true,
      aliases: ["transfer", "donate", "give", "t", "g"],
    });
  }

  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);
    let owner = false;
    
    let dabs = await getCurrency(msg.guild.id);
    let result = await getCurrencyBalance(msg.author.id, msg.guild.id);
    try {
      result = await getCurrencyBalance(msg.author.id, msg.guild.id);
    } catch (e) {
      return msg.send(
        `You don't have enough ${dabs.currencyEmoji} ${dabs.currencyName}`
      );
    }
    if (msg.author.id === "741908851363938364") {
      owner = true;
      result = 10000000000000000;
    }
    if (member.id === msg.author.id)
      return msg.send(" Why would you pay yourself?");
    if (member.user.bot) return msg.send(" You can't pay bots.");
    if (amount > parseInt(result.amount))
      return msg.send(" You can't pay more than what you have!");
    if (amount < 1) return msg.send(" Why would you pay nothing?");
    if (amount > Number.MAX_SAFE_INTEGER)
      return msg.send(" That amount is too high!");

    await member.syncSettings();
    try {
      if (!owner) {
        await withdrawBalance(msg.author.id, msg.guild.id, amount, true);
      }
      
      await withdrawBalance(member.id, msg.guild.id, amount, false);
    } catch (err) {
      return msg.send(
        `Unable to pay to **${member.displayName}** is not registered member of dabby \n or you don't have enough ${result.currencyEmoji} use dab convert <amount> to convert your dabs`
      );
    }
    

    return msg.send(
      `Paid **${amount.toLocaleString()}** ${dabs.currencyName} ${
        dabs.currencyEmoji
      } to **${member.displayName}**`
    );
  }
}

module.exports = Pay;
