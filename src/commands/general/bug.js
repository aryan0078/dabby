const Command = require("../../structures/Command.js");


class Bug extends Command {
  constructor(...args) {
    super(...args, {
      description: "Found a bug? report with this.",
      cooldown: 10,
      usage: "bug <report>",
      aliases: ["reportbug", "bugreport"],
    });
  }
  
  async run(msg, args) {
    if (!args.length) return msg.send(" What is the bug report?");
    const channel = this.client.channels.cache.get("849061099310546975");
    const embed = this.client
      .embed()
      .setTitle("Bug Report")
      .setDescription(args.join(" "))
      .setColor("#7289DA")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setFooter(msg.author.id);

    await channel.send("Bugreport", { embed: embed });
    return msg.send(
      `Your bug report has been sent${
        msg.guild && msg.guild.id === "843887160696635403"
          ? ""
          : " to the support server."
      } You will hear back from my owner in DMs if there is anything wrong with your report. Have a nice day!`
    );
  }
}

module.exports = Bug;
