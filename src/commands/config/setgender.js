const Command = require("../../structures/Command.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");

class SetGender extends Command {
    constructor(...args) {
        super(...args, {
            description: "Set gender of yourself for battle with tickets ",
            usage: "setgender male|female",
            guildOnly: true,
            cooldown: 50,
            aliases: ["sg"],
        });
    }

    async run(msg, gender) {
        let db = this.client.dbClient;
        db = await db.db();
        let user_ = db.collection("members");
        if (!gender) {
            return replyError(msg, 'Please Provide male or female properly', 5000)

        }

        if (gender == 'male') {
            let user = await user_.findOne({ id: msg.author.id });
            if (user.male || user.female) {
                user_.findOneAndUpdate({ id: msg.author.id }, { $set: { gender: 'male'} })
            } else {
                user_.findOneAndUpdate({ id: msg.author.id }, { $set: { gender: 'male' } })
            }
            return msg.send(`${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} you are now ${gender}`)
        } else if (gender == 'female') {
            let user = await user_.findOne({ id: msg.author.id });
            if (user.male || user.female) {
                user_.findOneAndUpdate({ id: msg.author.id }, { $set: { gender: 'male'} })
            } else {
                user_.findOneAndUpdate({ id: msg.author.id }, { $set: { gender: 'female'} })
            }
            return msg.send(`${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} you are now ${gender}`)
        } else {
            return replyError(msg, 'Please type male or female only', 5000)
        }
    }
}

module.exports = SetGender;
