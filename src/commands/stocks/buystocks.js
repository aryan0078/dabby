const Command = require("../../structures/Command.js");
const serverValue = require("../../structures/servervalue.js");

class BuyStocks extends Command {
  constructor(...args) {
    super(...args, {
      description: "Signup for stock",
      extendedHelp: "You can signup server for stock market",
      usage: "signup stock %your desired percentage to sell",

      aliases: ["stock", "stock signup"],
    });
  }

  async run(msg, pct) {
    if (!msg.guild.stockEnabled) {
      msg.send("Stocks are not enabled on this server you cannot buy");
      return;
    }
  }
}

module.exports = BuyStocks;
