const Command = require("../../structures/Command.js");

class EnableRole extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enables a command or event.",
      ownerOnly: true,
      usage: "m!enable <command|event>"
    });
  }

  async run(msg, user, role) {
    let mem = await this.verifyMember(msg, user)
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let badgeExist = await u.findOne({ id: mem.id })
    if (badgeExist[role]) {
      badgeExist[role] = !badgeExist[role]
      u.findOneAndUpdate({ id: mem.id }, { $set: badgeExist })
    } else {
      badgeExist[role] = !badgeExist[role]
      u.findOneAndUpdate({ id: mem.id }, { $set: badgeExist })
    }
    return msg.send('Badge given')
  }
}

module.exports = EnableRole;
