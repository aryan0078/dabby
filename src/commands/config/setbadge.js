const Command = require("../../structures/Command.js");
const { replyError } = require("../../utils/constants.js");

class SetBadge extends Command {
    constructor(...args) {
        super(...args, {
            description: "Set badge which is going to come on every command",
            aliases: ["setbadge", "stb", "sb", "sbadge"],

            usage: "setbadge badgeid",
            guildOnly: true
        });
    }

    async run(msg, [id]) {
        let db = this.client.dbClient;
        db = await db.db();
        let u = await db.collection("members");
        let badgeExist = await u.findOne({ id: msg.author.id });
        if (!badgeExist || !badgeExist.badges) {
            return replyError(msg, 'You dont have any badges', 5000)
        }
        if (!id) {
            return replyError(msg, 'Provide proper badge id according to your badges', 5000)
        }
        if (!this.badges[id]) {
            return replyError(msg, "You don't have this badge", 5000);
        }
        u.findOneAndUpdate({ id: msg.author.id }, { $set: { badge: id } });
        return msg.send(`${this.badges[id].emoji} **| ${msg.author.username
            }** ${await this.beta(msg) ? this.betaemoji : ''} updated badge `)
    }
}

module.exports = SetBadge;
