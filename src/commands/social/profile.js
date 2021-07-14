const Command = require("../../structures/Command.js");
const {getCurrency, getCurrencyBalance} =require("../../structures/database.js");
const { toFancyNum } = require("../../utils/constants.js");
const base64 = require('node-base64-image');
const fetch = require('node-fetch')
class Profile extends Command {
  constructor(...args) {
    super(...args, {
      description: "View your profile or someone's",
      usage: "profile [@user]",
      guildOnly: true
    });
  }

  async run(msg, [member]) {
    member = await this.verifyMember(msg, member, true);
    let db = this.client.dbClient;
    db = await db.db();
    let name = 'df'
    if (member.user.bot) return msg.send(" You can't view a bot's profile.");
    let dabs = await getCurrency(msg.guild.id, db);
    let bal = await getCurrencyBalance(msg.author.id, msg.guild.id, db);
    if (!bal) {
      bal = 0;
    }

    let u = await db.collection("members");
    let badgeExist = await u.findOne({ id: msg.author.id });
    let b = '';
    if (!badgeExist.badges) {
      b = 'No badges'
    } else {
      badgeExist.badges.forEach(ba => {

        b += `${this.badges[ba.badgeid].emoji} `
      })
    }

    const embed = this.client
      .embed(member.user)
      .setColor("#7289DA")
      .setTitle(b)
      .setDescription(
        member.user.settings.title ||
          `No Title set yet, use \`${msg.guild.settings.prefix}title\` to set one`
      )
      .setThumbnail(member.user.displayAvatarURL())

      .addField("DPI ID", `**${msg.author.id}@dpi**`)
      .addField(msg.tr("COMMAND_PROFILE_LEVEL"), member.settings.level)
      .addField(
        "Dabs",
        `**${toFancyNum(member.settings.points)}** <:dabs:851218687255773194>`
      )
      .addField(
        "Server Coins",
        `**${bal.amount ? parseInt(bal.amount).toLocaleString() : 0}** ${
          dabs.currencyName
        } ${dabs.currencyEmoji}`
      )
      .addField("Dab invites", `**${bal.invites ? bal.invites : 0}**`)

      .addField(msg.tr("COMMAND_PROFILE_REP"), member.user.settings.reputation);
    /*  const outputBuffer = await svg2png({
       input: ,
       encoding: 'buffer',
       format: 'png',
       quality: 1
     }) */


    return msg.send(`Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, { embed: embed });
  }
}

module.exports = Profile;
