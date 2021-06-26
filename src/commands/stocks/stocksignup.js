const Command = require("../../structures/Command.js");
const serverValue = require("../../structures/servervalue.js");

class StockSignup extends Command {
  constructor(...args) {
    super(...args, {
      description: "Signup for stock",
      extendedHelp: "You can signup server for stock market",
      usage: "signup stock %your desired percentage to sell",

      aliases: ["stock", "stock signup"],
    });
  }

  async run(msg, pct) {
    //console.log(msg.guild.ownerID, msg.author.id);
    if (msg.guild.stockEnabled) {
      msg.send("Stocks Already enabled");
      return;
    }
    //console.log(msg.guild.stockEnabled);
    if (true /* msg.guild.ownerID === msg.author.id */) {
      let percentage = pct.length <= 1 ? parseInt(pct[0]) : parseInt(pct[1]);
      let serverVal = await serverValue(msg.guild, msg);
      msg.send(
        `You signup on sale and your Total server value is :` +
          serverVal +
          "\n49% value of server value is:" +
          (serverVal * 49) / 100
      );
      msg.guild.update({ stockEnabled: true });
      msg.guild.set;
      if (percentage > 49) {
        return msg.send(
          `You want to sell everything you have please don't ,please sell your kidney if you really want to earn money`
        );
      }
    } else {
      return msg.send(
        "Umm you are not the owner how you are supposed to signup for stocks"
      );
    }

    /* if (amount > parseInt(msg.member.settings.points))
      return msg.send("You can't bet more than what you have!");
    const flipped = this.client.utils.random(["Heads", "Tails"]);
    if (flipped === "Tails") {
      msg.send(`You won ${amount * 2} flaps `);
      msg.member.takePoints(amount);
      msg.member.takePoints(amount * 2);
    } else {
      msg.send(`You Loss ${amount}`);
      msg.member.takePoints(amount);
    }
    return msg.send(`The coin landed on \`${flipped}\` `); */
  }
}

module.exports = StockSignup;
