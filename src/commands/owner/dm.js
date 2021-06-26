const Command = require("../../structures/Command.js");

class DM extends Command {
  constructor(...args) {
    super(...args, {
      description: "DMs someone",
      ownerOnly: true,
      usage: "dm <user> <msg...>",
      aliases: ["pm"]
    });
  }

  async run(msg, [user, ...message]) {
    user = await this.verifyUser(msg, user);

    try {
      await user.send(`${message.join(" ")}`);
      return msg.send(`Message sent to **${user.tag}** (${user.id})`);
    } catch(err) {
      if(err.status === 403) return msg.send("I cannot DM that user, they probably have DMs blocked.");
      throw err;
    }
  }
}

module.exports = DM;
