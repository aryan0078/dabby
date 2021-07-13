const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command.js");
const { replyError } = require("../../utils/constants.js");


class Badge extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a themed badge from robohash.org",
      usage: "badge [@user] [set]",
      extendedHelp: "These are your unique hashes generated by your user ID.",
      aliases: ["robohash"]
    });
  }

  async run(msg, [user, set = 1]) {
    user = await this.verifyUser(msg, user, true);

    if (isNaN(parseInt(set)) || (parseInt(set) < 0 || parseInt(set) > 5))
      return msg.send("Set must be a number between 1 to 5");
    let badges = {
      "1": { emoji: '<:bughunter:864570206894686238>', name: 'Bug Hunter', id: 1 }, "2": { id: 2, emoji: '<:supporter:864572703918129172>', name: 'Supporter' }, "3": { id: 3, emoji: '<:partner:864571816932933672>', name: 'Partner' }
    }
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
    return msg.send(`Badges of **${msg.author.username}**`, { embed: em })

  }
}

module.exports = Badge;
