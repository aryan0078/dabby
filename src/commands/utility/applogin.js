const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const {
  getCurrency,
  getCurrencyBalance,
} = require("../../structures/database.js");
const { uid } = require("uid");
class SetReferid extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get the code to login in app",
      usage: "app code",
      guildOnly: true,
      cooldown: 10,
      aliases: ["appcode"],
    });
  }

  async run(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let user_ = db.collection("members");
    let code = uid(18);
    user_.findOneAndUpdate(
      { id: msg.author.id },
      {
        $set: {
          avatar: msg.author.displayAvatarURL(),
          apploginToken: code,
          username: msg.author.username,
        },
      }
    );
    msg.author.send(`You code to login in App is \n${code}`);
    return msg.send(`Check dm for secret code`);
  }
}

module.exports = SetReferid;
