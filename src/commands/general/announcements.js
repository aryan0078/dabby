const Command = require("../../structures/Command.js");


class Announcements extends Command {
  constructor(...args) {
    super(...args, {
      name: "announcements",
      description: "Get bot related announcements.",
      usage: "announcements",
      aliases: ["announce", "news", "announcement", "anc"],
    });
  }

  async run(msg) {
    const guild = this.client.guilds.cache.get("843887160696635403"); //Dabby support server ID
    const channel = guild.channels.cache.get("844535591802109982");
    const messages = await channel.messages.fetch({ limit: 1 });
    const announcement = messages.first();
    
    const embed = this.client
      .embed()
      .setTitle(msg.tr("COMMAND_ANNOUNCEMENTS_TITLE"))
      .setColor("#7289DA")
      .setAuthor(
        announcement.author.username,
        announcement.author.displayAvatarURL({ size: 64 })
      )
      .setDescription(announcement.cleanContent)
      .setThumbnail(announcement.author.displayAvatarURL({ size: 512 }))
      .setTimestamp(new Date(announcement.createdTimestamp))
      .setFooter(
        msg.tr(
          "COMMAND_ANNOUNCEMENTS_FOOTER",
          msg.guild ? msg.guild.prefix : "m!"
        )
      );

    return msg.send("Announcements", { embed: embed });
  }
}

module.exports = Announcements;
