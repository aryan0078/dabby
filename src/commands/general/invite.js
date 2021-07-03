const Command = require("../../structures/Command.js");

class Invite extends Command {
  constructor(...args) {
    super(...args, {
      description: "Invite me to your server!",
      aliases: ["inv"]
    });
  }

  async run(msg, args) { // eslint-disable-line no-unused-vars
    const { link } = this.client.utils;

    return msg.send(`Requested by **${msg.author.username}**`, {
      embed: this.client
        .embed(this.client.user)
        .setColor("#7289DA")
        .setAuthor("Invite Bot", msg.author.displayAvatarURL())

        .setDescription(
          [
            "You can invite me to your server using the following link:",
            link(
              "Invite Link",
              "https://discord.com/oauth2/authorize?client_id=784717683454378024&permissions=2081291377&scope=bot"
            ),
            
          ].join("\n")
        ),
    });
  }
}

module.exports = Invite;

