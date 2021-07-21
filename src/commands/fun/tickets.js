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
            cooldown: 15,
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
            let str = `Your All ticket ids are, `
            if (!ticket) {
                return replyError(msg,'You dont have any tickets',5000)
            }
           ticket.map(t=>str+=`**${t.id}**,`)
            for (let index = 0; index < ticket.length; index++) {
                const tic = ticket[index];
                if (index > 1) {
                      msg.author.send(str)
                    return msg.send(`**Check Dm for all tickets**`).then(m => {
                m.react('👍');
            })
                }
                if (!tic.link) {
                    msg.author.send(`Ticket id **${tic.id}** is hidden will be shown soon`)
                }
                if (tic.link) {
                    let dmembed = new MessageEmbed()
                    dmembed.setImage(tic.link)
                    msg.author.send(`Ticket id **${tic.id}**`, { embed: dmembed })
                }
            }
          

        }
        if (index!='all'&&index) {
            if (!parseInt(index)) {
                return replyError(msg, "please input proper ticket id", 5000)
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
