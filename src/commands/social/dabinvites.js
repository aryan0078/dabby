const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
class Dabinvites extends Command {
  constructor(...args) {
    super(...args, {
      description: "Check your total invites",
      usage: "dabusers [@user]",
      guildOnly: true,
      cooldown: 10,
      aliases: ["inv", "invites", "di"],
    });
  }

  async run(msg, [user]) {
    const member = await this.verifyMember(msg, user, true);

    if (member.user.bot)
      return msg.send(" You fool you can't get invited by bot");
    await member.syncSettings();
    let db = this.client.dbClient;

    db = await db.db();
    let user_ = db.collection("members");
    let inviter = await user_.findOne({ id: member.id });
    if (!inviter) {
      return replyError(msg, "User is not registered", 5000);
    }

    if (user) {
      return msg.send(
        `<@${member.id}> invited **${
          inviter.invites ? inviter.invites.length : 0
        }** users to dabby`
      );
    }

    let invited = await user_.findOne({ id: msg.author.id });
    if (!invited) {
      return replyError(msg, "You are not registered use **dab cash**", 5000);
    }
    return msg.send(
      `**${msg.author.username} |** has invited **${
        invited.invites ? invited.invites.length : 0
      }** users`
    );
  }
}

module.exports = Dabinvites;
