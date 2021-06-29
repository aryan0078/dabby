const Command = require("../../structures/Command.js");

class MyID extends Command {
  constructor(...args) {
    super(...args, {
      description: "Retrieve your User ID.",
      aliases: ["uid"],
    });
  }

  async run(msg, [user]) {
    let member = await this.verifyMember(msg, user, true);
    return msg.sendLocale("COMMAND_MYID", [member]);
  }
}

module.exports = MyID;
