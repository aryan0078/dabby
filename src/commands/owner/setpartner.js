const Command = require("../../structures/Command.js");
const { addPool } = require("../../structures/database.js");

class GiveBadge extends Command {
    constructor(...args) {
        super(...args, {
            description: "Give someone badge",
            ownerOnly: true,
            usage: "givebadge id",
        });
    }

    async run(msg, [user, id]) {
        let mem = await this.verifyMember(msg, user)
        let db = this.client.dbClient;
        db = await db.db();
        let u = await db.collection("members");
        let badgeExist = await u.findOne({ id: mem.id })
        if (badgeExist.badges) {
            u.findOneAndUpdate({ id: mem.id }, { $push: { badges: { badgeid: id } } })
        } else {
            u.findOneAndUpdate({ id: mem.id }, { $set: { badges: [{ badgeid: id }] } })
        }
        return msg.send('Badge given')

    }
}

module.exports = GiveBadge;
