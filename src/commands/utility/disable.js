const Command = require("../../structures/Command.js");
const { channelEandD } = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");

class disable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Disable dabby for specific channel in server",
      aliases: ["disable"],
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  async run(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    await channelEandD(msg.channel.id, false, db);
    return replyError(
      msg,
      "Dabby commands are disabled in this channel Now!",
      5000
    );
  }
}

module.exports = disable;
