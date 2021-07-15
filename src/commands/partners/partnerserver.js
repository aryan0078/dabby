const Command = require("../../structures/Command.js");
const { addPool } = require("../../structures/database.js");

class PartnerServer extends Command {
    constructor(...args) {
        super(...args, {
            description: "If you are partner for any server run this command in that server it will be added in your profile",
            ownerOnly: false,
            usage: "ps",
            aliases: ["ps", "addserver", "pserver"],
        });
    }

    async run(msg) {

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

module.exports = PartnerServer;
