const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command.js");
const { replyError } = require("../../utils/constants.js");


class Badge extends Command {
  constructor(...args) {
    super(...args, {
      description: "Badges",
      usage: "badge [@user]",
      extendedHelp: "These are your Badges",
      aliases: ["badge", "badges"]
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);


    let badges = this.badges
    let embeds = [];
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let badgeExist = await u.findOne({ id: msg.author.id });
    if (!badgeExist || !badgeExist.badges) {
      return replyError(msg, 'You dont have any badges', 5000)
    }

    let b = '';
    badgeExist.badges.forEach(ba => {

      b += `${badges[ba.badgeid].emoji} **${badges[ba.badgeid].name}**\n`
    })
    let em = new MessageEmbed()
      .setDescription(b)
      .setColor("#7289DA");
    return msg.send(`${await this.badge(msg)} **|** Badges of **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, { embed: em })

  }
}

module.exports = Badge;
