const { MessageEmbed } = require("discord.js");
const randomNumber = require("random-number-csprng");
const Command = require("../../structures/Command.js");

const {
  getAllCrates,
  addCrate,
  giveTicket,
  openCrate,
  removeOneCrate,
  getTicket,
  getAllTickets,
} = require("../../structures/database.js");
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
    let ticket;
    let ticketembed = new MessageEmbed();
    ticket = await getAllTickets(msg, false, db);
    if (ticket.length == 0) {
      return replyError(msg, "You dont have any tickets", 5000);
    }

    if (!index || index == undefined || index == null || index == "") {
      /*   const emojiNext = "<a:right:874002549617868850>";
      const emojiPrevious = "<a:left:874002479682060298>"; */
      const emojiNext = "➡"; // unicode emoji are identified by the emoji itself
      const emojiPrevious = "⬅";
      const reactionArrow = [emojiPrevious, emojiNext];
      const time = 120000; // time limit: 1 min
      const list = [];

      ticket = await getAllTickets(msg, false, db);

      ticket.forEach((ti) => {
        let li = new MessageEmbed()

          .setDescription(`**Name :- ${ti.name} | HP :- ${ti.hp}**`)
          .setImage(ti.link)
          .setColor(`#7289DA`)
          .setFooter(`Ticket id :- ${ti.id}`);
        list.push(li);
      });

      if (!ticket) {
        return replyError(msg, "You dont have any tickets", 5000);
      }
      function filter(reaction, user) {
        return !user.bot && reactionArrow.includes(reaction.emoji.name); // check if the emoji is inside the list of emojis, and if the user is not a bot
      }
      function onCollect(emoji, message, i, getList) {
        if (emoji.name === emojiPrevious && i > 0) {
          message.edit(getList(--i));
        } else if (emoji.name === emojiNext && i < list.length - 1) {
          message.edit(getList(++i));
        }
        return i;
      }
    
      async function sendList(channel, getList) {
        channel
          .send(
            `Requested by **${msg.author.username}**`,
            {
              embed: getList(0),
            }
          )
          .then((msg) => msg.react(emojiPrevious))
          .then((msgReaction) => msgReaction.message.react(emojiNext))
          .then((msgReaction) =>
            createCollectorMessage(msgReaction.message, getList)
          );
      }
      function getList(i) {
        return list[i]; // i+1 because we start at 0
      }
      function createCollectorMessage(message, getList) {
        let i = 0;

        const collector = message.createReactionCollector(filter, {
          time,
        });
        collector.on("collect", (r) => {
          i = onCollect(r.emoji, message, i, getList);
          
            message.reactions.resolve("➡").users.remove(msg.author);
            message.reactions.resolve("⬅").users.remove(msg.author);
      
        });
        collector.on("end", (collected) => {
          console.log(`collection end`);
        });
      }
      return sendList(msg.channel, getList);
    }
    if (index != "all" && index) {
      if (!parseInt(index)) {
        return replyError(msg, "please input proper ticket id", 5000);
      }
      ticket = await getAllTickets(msg, index, db);
      if (!ticket) {
        return replyError(msg, "**You don`t have this with this id**", 5000);
      }

      if (!ticket.link) {
        return msg.send(
          `${await this.badge(msg)} **${msg.author.username}** ${
            (await this.beta(msg)) ? this.betaemoji : ""
          },\n**This ticket is hidden will be show soon**`
        );
      }
      ticketembed.setImage(ticket.link);
      return msg.send(
        `${await this.badge(msg)} **${msg.author.username}** ${
          (await this.beta(msg)) ? this.betaemoji : ""
        },\nYour ticket`,
        { embed: ticketembed }
      );
    }

    ticket = await getAllTickets(msg, false, db);
    if (!ticket) {
      return replyError(
        msg,
        "You dont have any tickets buy crate from support server in #crate\nopen it by `dab crate open`\nyou will get ticket in crates",
        12000
      );
    }
    if (!ticket[0].link) {
      return msg.send(
        `${await this.badge(msg)} **${msg.author.username}** ${
          (await this.beta(msg)) ? this.betaemoji : ""
        },\nYour ticket is hidden will be show soon`
      );
    }
    ticketembed.setImage(ticket[0].link);
    return msg.send(
      `${await this.badge(msg)} **${msg.author.username}** ${
        (await this.beta(msg)) ? this.betaemoji : ""
      },\n**A random ticket from your deck**`,
      { embed: ticketembed }
    );
  }
}

module.exports = Tickets;
