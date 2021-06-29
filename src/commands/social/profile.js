const Command = require("../../structures/Command.js");
const {getCurrency, getCurrencyBalance} =require("../../structures/database.js");
const { toFancyNum } = require("../../utils/constants.js");

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
    if (member.user.bot) return msg.send(" You can't view a bot's profile.");
    let dabs = await getCurrency(msg.guild.id, db);
    let bal = await getCurrencyBalance(msg.author.id, msg.guild.id, db);
    if (!bal) {
      bal = 0;
    }
    const embed = this.client
      .embed(member.user)
      .setTitle(msg.tr("COMMAND_PROFILE_TITLE", member.displayName))
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
        `**${bal.amount?parseInt(bal.amount).toLocaleString():0}** ${dabs.currencyName} ${
          dabs.currencyEmoji
        }`
      )
      .addField("Dab invites", `**${bal.invites?bal.invites:0}**`)

      .addField(msg.tr("COMMAND_PROFILE_REP"), member.user.settings.reputation);

    return msg.send("Profile", { embed: embed });
  }
}

module.exports = Profile;
