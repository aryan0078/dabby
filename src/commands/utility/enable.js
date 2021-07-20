const Command = require("../../structures/Command.js");
const { channelEandD } = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");

class enable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enable dabby for specific channel in server",
      aliases: ["enable"],
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  async run(msg,[args]) {
    let db = this.client.dbClient;
    db = await db.db();
   
    await channelEandD(msg.channel.id, true, args == "mimic" ? true : false, db);
    if (args == "mimic") {
      return replyError(
        msg,
        "Mimic command is enabled now in this channel",
        5000
      );
    } else {
      return replyError(
        msg,
        "Dabby commands are enabled now in this channel",
        5000
      );
    }
  }
}

module.exports = enable;
