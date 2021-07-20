const Command = require("../../structures/Command.js");

class Upvote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Upvote for me!",
      aliases: ["vote"]
    });

    this.url = "https://top.gg/bot/397796982120382464/vote";
  }

  async run(msg) {
    return msg.send(`Upvote me here: https://top.gg/bot/784717683454378024`);
  }
}

module.exports = Upvote;
