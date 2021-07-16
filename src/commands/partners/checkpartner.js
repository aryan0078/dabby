const Command = require("../../structures/Command.js");
const { addPool } = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");

class CheckPartner extends Command {
    constructor(...args) {
        super(...args, {
            description: "Check partner for the server",

            usage: "cp",
            aliases: ['cp']
        });
    }

    async run(msg) {


        let db = this.client.dbClient;
        db = await db.db();
        if (await this.globalpartnercheck(msg) || await this.workercheck(msg) || await this.guidercheck(msg)) {
            let user = await this.verifyMember(msg, msg.author.user, true);

            let u = await db.collection("partners");
            let f = `Partners for **${msg.guild.name}** Please check time carefully then verify otherwise we have to take actions\nIn DM\n`
            let p = await u.find({ server: msg.guild.id }).sort({ at: 1 }).toArray()
            p.forEach(async (element, index) => {


                let user = await this.client.users.fetch(element.id)

                f += `**${user.username}** at ${new Date(element.at)}\n`
            });

            return msg.send(f).then(ms => {
                user.send(f);
            })
        }
        else {


            return replyError(msg, 'This command is only for global partners,partners,workers,guiders', 5000)
        }









    }
}

module.exports = CheckPartner;
