const Command = require("../../structures/Command.js");

class ServerIcon extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns the server icon.",
      aliases: ["serverlogo"],
      guildOnly: true
    });
  }
  
  async run(msg) {
    if (!msg.guild.iconURL()) throw "There is no server icon in this server. What do you expect me to show you?";

    const embed = this.client
      .embed(msg.author)
      .setTitle(msg.tr("COMMAND_SERVERICON_TITLE", msg.guild.name))
      .setColor("#7289DA")
      .setImage(msg.guild.iconURL({ size: 2048 }));

    return msg.send(`Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, { embed: embed });
  }
}

module.exports = ServerIcon;
