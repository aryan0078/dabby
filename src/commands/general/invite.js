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

    return msg.send('Invite',
      {embed:this.client
        .embed(this.client.user)
        .setTitle("Invite Dabby to your server")
        .setDescription(
          [
            "You can invite me to your server using the following link:",
            "",
            "",
            link(
              "Invite Link",
              "https://discord.com/api/oauth2/authorize?client_id=843893189025988619&permissions=8&scope=bot"
            ),
            link("Join dabby Server", "https://discord.gg/5DVHcRFzbx"),
          ].join("\n")
        )}
    );
  }
}

module.exports = Invite;

