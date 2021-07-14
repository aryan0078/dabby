const Command = require("../../structures/Command.js");


class Support extends Command {
  constructor(...args) {
    super(...args, {
      description: (msg) => msg.tr("COMMAND_SUPPORT_DESCRIPTION")
    });
  }

  async run(msg) {
    const { link } = this.client.utils;
    return msg.send(
      
      
      
      `${await this.badge(msg)}  Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}\n` +
              "Support server :- https://discord.gg/MEaMMjG7VJ",

      {
        embed: this.client
          .embed(this.client.user)
          .setColor("#7289DA")
          .setAuthor("Dabby Support", msg.author.displayAvatarURL())
          .setTitle(msg.tr("COMMAND_SUPPORT_TITLE"))
          .setDescription(
            "If you need help with setting me up on your server or just want to hangout, join Dabby support server .\nYou also get an oppurtunity to become a Server partner which can only be obtained through a role in our server.\nYou will also recieve updates about the bot and much more!\n"
          ),
      }
    );
  }
}

module.exports = Support;
