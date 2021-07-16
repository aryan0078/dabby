const Command = require("../../structures/Command.js");
const { addPool } = require("../../structures/database.js");

class CheckPartner extends Command {
    constructor(...args) {
        super(...args, {
            description: "Check partner for the server",
            ownerOnly: true,
            usage: "cp",
        });
    }

    async run(msg) {


        let db = this.client.dbClient;
        db = await db.db();


        let u = await db.collection("partners");
        let f = `Requested by **${msg.author.username}**\n`
        let p = await u.find({ server: msg.guild.id }).sort({ at: 1 }).toArray()
        p.forEach(async (element, index) => {
            if (index > 5) {
                return
            }

            let user = await this.client.users.fetch(element.id)

            f += `**${user.username}** at ${new Date(element.at)}\n`
        });

        return msg.send(f).then(ms => {
            ms.edit(f);
        })












    }
}

module.exports = CheckPartner;
