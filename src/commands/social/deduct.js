const Command = require("../../structures/Command.js");

class Deduct extends Command {
  constructor(...args) {
    super(...args, {
      description: "Deduct someone's points.",
      userPermissions: ["ADMINISTRATOR"],
      cooldown: 1,
      usage: "deduct <@user> <amount>",
      aliases: ["punish", "take"],
      guildOnly: true,
      cost: 5,
    });
  }
  
  async run(msg, [member, amount]) {
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);

    if (member.user.bot) return msg.send(" Bots can't have points.");
    if (member.user.id === msg.author.id)
      return msg.send(" You can't punish yourself. Why did you even try it?");
    
    if (amount < 0) return msg.rely(" You can't deduct a negative amount.");
    if (amount === 0) return msg.send(" Why would you deduct nothing?");

    // Synchronize settings before reading points.
    await member.syncSettings();

    if (member.points < amount)
      return msg.send(" You can't deduct more than their balance.");

    await member.takePoints(amount);

    return msg.send(
      `Successfully deducted **${amount.toLocaleString()}** from ${member}`
    );
  }
}

module.exports = Deduct;
