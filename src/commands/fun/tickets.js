const { MessageEmbed } = require("discord.js");
const randomNumber = require("random-number-csprng");
const Command = require("../../structures/Command.js");
const { getAllCrates, addCrate, giveTicket, openCrate, removeOneCrate, getTicket, getAllTickets } = require("../../structures/database.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");

class Tickets extends Command {
    constructor(...args) {
        super(...args, {
            description: "See your tickets",
            usage: "ticket {ticketid} or ticket all",
            guildOnly: true,
            cooldown: 10,
            aliases: ["tickets", "ticket"],
        });
    }

    async run(msg, [index]) {

        let db = this.client.dbClient;

        db = await db.db();
        let ticket
        let ticketembed = new MessageEmbed()
        ticket = await getAllTickets(msg, false, db);
        if (ticket.length == 0) {
            return replyError(msg, 'You dont have any tickets', 5000)
        }
       
        
        if (index == 'all') {
            ticket = await getAllTickets(msg, false, db)
            msg.author.send(`**Your All tickets**\n`)
            let ticketids = 'You have '
            ticket.map(t=>ticketids+=`**${t.id}**\n`)
            ticket.forEach((ticket, index) => {
                if (index > 2) {
                    msg.author.send(`\n ${ticketids}`)
                    return
                }
                if (!ticket.link) {
                    msg.author.send(`Ticket id **${ticket.id}** is hidden will be shown soon`)
                }
                if (ticket.link) {
                    let dmembed = new MessageEmbed()
                    dmembed.setImage(ticket.link)
                    msg.author.send(`Ticket id **${ticket.id}**`, { embed: dmembed })
                }
            });
            return msg.send(`**Check Dm for all tickets**`).then(m => {
                m.react('👍');
            })

        }
        if (index) {
            if (!parseInt(index)) {
                return replyError(msg, "please input proper index", 5000)
            }
            ticket = await getAllTickets(msg, index, db)
            if (!ticket) {
                return replyError(msg, '**You don`t have this with this id**', 5000)
            }

            if (!ticket.link) {
                return msg.send(`${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''},\n**This ticket is hidden will be show soon**`)
            }
            ticketembed.setImage(ticket.link)
            return msg.send(`${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''},\nYour ticket`, { embed: ticketembed })
        }


        ticket = await getAllTickets(msg, false, db);
        if (!ticket) {
            return replyError(msg, 'You dont have any tickets buy crate from support server in #crate\nopen it by `dab crate open`\nyou will get ticket in crates', 12000)
        }
        if (!ticket[0].link) {
            return msg.send(`${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''},\nYour ticket is hidden will be show soon`)
        }
        ticketembed.setImage(ticket[0].link)
        return msg.send(`${await this.badge(msg)} **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''},\n**A random ticket from your deck**`, { embed: ticketembed })








    }
}

module.exports = Tickets;
