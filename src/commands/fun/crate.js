const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command.js");
const { getAllCrates, addCrate, giveTicket, openCrate, removeOneCrate, getTicket } = require("../../structures/database.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");

class GenerateCoupons extends Command {
    constructor(...args) {
        super(...args, {
            description: "Open your crates",
            usage: "crate",
            guildOnly: true,
            cooldown: 10,
            aliases: ["crate", "lootbox"],
        });
    }

    async run(msg, args) {

        let db = this.client.dbClient;

        db = await db.db();

        let crates = await getAllCrates(msg, db);
        if (crates.length == 0) {

            return replyError(msg, "you dont have any crates", 5000);
        }

        if (args == "open") {
            if (!msg.member.settings.gender) {
                return replyError(msg, '**Please set your gender before opening crates**\nuse \`dab sg\`', 8000)
            }


            let tid = await openCrate(msg, db);
            let ticket = await getTicket(tid, db);

            if (!tid) {
                msg.member.givePoints(500000);
                await removeOneCrate(msg, db)
                return replyError(msg, `You got a refund of ${toFancyNum(500000)} <:dabs:851218687255773194> dabs`, 8000)
            }
            let embed = new MessageEmbed().setImage('https://media.giphy.com/media/5YrT02HhIpbiqFbF4j/giphy.gif')
            if (!ticket) {
                return msg.send(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**You Opend a crate **`, { embed: embed }).then(m => {
                    setTimeout(async () => {
                        m.edit(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**And recived hidden character will be visible soon**`)
                    }, 5000)
                })
               // return replyError(msg, `${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**You Opend a crate**\nand Recived hidden character **will be visible soon**`, 8000)
            }

            let ticketembed = new MessageEmbed().setImage(ticket.link)
 
             msg.send(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**You Opend a crate**`, { embed: embed }).then(m => {
                 setTimeout(async () => {
                     m.edit(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**And recived**`, { embed: ticketembed })
                 }, 5000)
             })
        } else {
            return msg.send(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\nYou have **${crates.length}** ${this.crate} crate\nuse \`dab crate open\` to open crates`)
        }






    }
}

module.exports = GenerateCoupons;
