const Command = require("../../structures/Command.js");
const { getCurrency } = require("../../structures/database.js");
const {MessageButton,MessageActionRow}=require("discord-buttons");
const { toFancyNum, replyError } = require("../../utils/constants.js");
class Request extends Command {
  constructor(...args) {
    super(...args, {
      description: "Request for some currency",
      cooldown: 100,
      usage: "request <@member> <amount>",
      guildOnly: true,
      aliases: ["request", "req", "beg"],
    });
  }

  async run(msg, [member, amount, ...reason]) {
    /*  return msg.send('Coming Soon....') */
    member = await this.verifyMember(msg, member);
    amount = this.verifyInt(amount);

    let db = this.client.dbClient;
    db = await db.db();
    if (reason) {
      let f = reason.join(",");
      if (
        f.includes("https://") ||
        f.includes("http://") ||
        f.includes(".com") ||
        f.includes(".net") ||
        f.includes(".gg")
      ) {
        return replyError(
          msg,
          "You included link in your reason thats no allowed",
          5000
        );
      }
    }
    if (member.id === msg.author.id)
      return msg.send(" Why would you request yourself?");
    if (member.user.bot) return msg.send(" You can't request bots.");
    if (amount > parseInt(50000000))
      return msg.send(" You can't request that much!");
    if (amount < 1) return msg.send("You can't request that amount");
    if (amount > Number.MAX_SAFE_INTEGER)
      return msg.send(" That amount is too high!");
    await member.syncSettings();

    let acceptButton = new MessageButton()
      .setLabel("Accept")
      .setStyle("green")

      .setID(`accept:${member.id}:${amount}:${msg.author.id}`);

    let rejectButton = new MessageButton()
      .setLabel("Reject")
      .setStyle("red")

      .setID(`reject:${member.id}:${amount}:${msg.author.id}`);
    let row = new MessageActionRow()
      .addComponent(acceptButton)
      .addComponent(rejectButton);
    try {
      msg.send(
        `${await this.badge(msg)} **|${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} | payment request of **${toFancyNum(
          amount
        )}** <:dabs:851218687255773194> dabs is sent to **<@${member.id}>**`
      );
      member.send(
        `${await this.badge(msg)} **| ${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} is requesting for **${toFancyNum(
          amount
        )}** <:dabs:851218687255773194> dabs reason:\n${reason ? reason.join(" ") : "Not provided"
        }`,
        row
      );
    } catch (err) {
      msg.send(`**<@${member.id}>** dm is off can't request`);
    }
  }


}

module.exports = Request;
