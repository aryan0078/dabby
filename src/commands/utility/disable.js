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

  async run(msg,[args]) {
   let db = this.client.dbClient;
    db = await db.db();
   
    await channelEandD(msg.channel.id, false, args == "mimic" ?false : true, db);
    if (args == "mimic") {
      return replyError(
        msg,
        "Mimic command is disabled now in this channel",
        5000
      );
    } else {
      return replyError(
        msg,
        "Dabby commands are disabled now in this channel",
        5000
      );
    }
  }
}

module.exports = disable;
