const { MessageEmbed } = require("discord.js");
const randomNumber = require("random-number-csprng");
const Command = require("../../structures/Command.js");
const { getAllCrates, addCrate, openCrate, getTicket } = require("../../structures/database.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");

class AddTicket extends Command {
    constructor(...args) {
        super(...args, {
            description: "Add Ticket",
            usage: "add {hp} {id} link",
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
        if (!msg.member.settings.gender) {
            return replyError(msg, `You have to set your gender first\nuse \`dab sg\` to set it`)
        }


        if (args == "open") {
            let tid = await openCrate(msg, db);
            let ticket = await getTicket(tid, db);
            if (!ticket) {
                return replyError(msg, 'This character is hidden you can see it soon....', 8000);
            }
            let embed = new MessageEmbed().setImage('https://media.giphy.com/media/5YrT02HhIpbiqFbF4j/giphy.gif')
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

module.exports = AddTicket;
