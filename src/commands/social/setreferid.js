const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const {
  getCurrency,
  getCurrencyBalance,
} = require("../../structures/database.js");
class SetReferid extends Command {
  constructor(...args) {
    super(...args, {
      description: "Set id of the inviter",
      usage: "setinvite [@user]",
      guildOnly: true,
      cooldown: 10,
      aliases: ["sti", "setinv", "refer", "referid", "ref"],
    });
  }

  async run(msg, [user]) {
    const member = await this.verifyMember(msg, user, true);

    if (member.user.bot)
      return msg.send(" You fool you can't get invited by bot");
    await member.syncSettings();
    if (member.id == msg.author.id) {
      return msg.send(`You can't set yourself as inviter `);
    }
    let db = this.client.dbClient;
    db = await db.db();
    let user_ = db.collection("members");

    let invited = await user_.findOne({ id: msg.author.id });
    let inviter = await user_.findOne({ id: member.id });
    if (!inviter) {
      return replyError(msg, "User is not registered on dabby", 5000);
    }
    if (invited.referid) {
      return msg.send(
        `**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}  you are invited by <@${inviter.referid}> already and he got the rewards already`
      );
    } else {
      if (inviter.invites) {
        await user_.findOneAndUpdate(
          { id: member.id },
          { $push: { invites: [msg.author.id] } }
        );
        await user_.findOneAndUpdate(
          { id: msg.author.id },
          { $set: { referid: member.id } }
        );
      } else {
        await user_.findOneAndUpdate(
          { id: member.id },
          { $set: { referid: member.id, invites: [msg.author.id] } }
        );
      }
    }
    member.givePoints(2500);
    msg.member.givePoints(1000);
    return msg.send(
      `${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}  you got **1000** <:dabs:851218687255773194> for setting up referid and <@${member.id}> will get **2500** <:dabs:851218687255773194> for inviting you`
    );
  }
}

module.exports = SetReferid;
