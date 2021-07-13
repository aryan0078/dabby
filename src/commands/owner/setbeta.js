const Command = require("../../structures/Command.js");


class GiveBeta extends Command {
    constructor(...args) {
        super(...args, {
            description: "Give someone beta",
            ownerOnly: true,
            usage: "givebeta",
        });
    }

    async run(msg, [user]) {
        let mem = await this.verifyMember(msg, user)
        let db = this.client.dbClient;
        db = await db.db();
        let u = await db.collection("members");
        let badgeExist = await u.findOne({ id: mem.id })
        if (badgeExist.beta) {
            u.findOneAndUpdate({ id: mem.id }, { $set: { beta: !badgeExist.beta } })
        } else {
            u.findOneAndUpdate({ id: mem.id }, { $set: { beta: true } })
        }
        return msg.send('Beta tag updated for the user')


    }
}

module.exports = GiveBeta;
