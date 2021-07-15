const Command = require("../../structures/Command.js");
const { addPool } = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");

class VerifyServer extends Command {
    constructor(...args) {
        super(...args, {
            description: "This command is used by partners to verify user for partnership in the server",
            ownerOnly: false,
            usage: "vs @user",
            aliases: ["verifyserver", "vs"],
        });
    }

    async run(msg,) {

        let db = this.client.dbClient;
        db = await db.db();
        let u = await db.collection("partners");
        let p = await u.findOne({ id: msg.author.id, server: msg.guild.id })
        if (p) {
            await u.findOneAndUpdate({ id: msg.author.id }, { $set: { id: msg.author.id, server: msg.guild.id, at: new Date(), channel: msg.channel.id } })
        } else {
            await u.insertOne({ id: msg.author.id, server: msg.guild.id, at: new Date(), channel: msg.channel.id, verified: false })
        }
        return msg.send(`**${msg.author.username}** Successfully added this server on profile \n Soon partner will come and verify it \nThank you`)


    }
}

module.exports = VerifyServer;
