const Command = require("../../structures/Command.js");


class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: "Got a suggestion to improve the bot?",
      usage: "suggestion <idea>",
      aliases: ["suggest"],
      cooldown: 60
    });
  }
  
  async run(msg, args) {
    if (!args.length) return msg.send(" What's your idea?");

    const channel = this.client.channels.cache.get("844579080854700052");

    const embed = this.client
      .embed()
      .setTitle("New Suggestion")
      .setDescription(args.join(" "))
      .setThumbnail(msg.author.displayAvatarURL({ size: 512 }))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 512 }))
      .setFooter(`User ID: ${msg.author.id}`);

    const message = await channel.send("Suggestion", { embed: embed });

    return msg.send(
      `Your idea has been successfully submitted${
        msg.guild && msg.guild.id !== "843887160696635403"
          ? " to the support server"
          : ""
      }.`
    );
  }
}

module.exports = Suggestion;
