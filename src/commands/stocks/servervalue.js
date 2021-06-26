const Command = require("../../structures/Command.js");
const serverValue = require("../../structures/servervalue.js");
const { toFancyNum } = require("../../utils/constants.js");
const { getCurrency } = require("../../structures/database.js");
class ServerValue extends Command {
  constructor(...args) {
    super(...args, {
      description: "Server value in server currency",
      extendedHelp:
        "You can see your server value in your native server currency from which your currency value is decided",
      usage: "dab sv",
      cooldown: 10,
      aliases: [
        "server value",
        "server val",
        "server val",
        "server wal",
        "sw",
        "sv",
        "server w",
      ],
    });
  }

  async run(msg, pct) {
    let percentage = pct.length <= 1 ? parseInt(pct[0]) : parseInt(pct[1]);
    let serverVal = await serverValue(msg.guild, msg);
    let dabs = await getCurrency(msg.guild.id);
    pct.length == 1
      ? msg.send(
          "Server total value is: `" +
            serverVal +
            "`\n**" +
            percentage +
            "%** value of server value is: `" +
            (serverVal * pct) / 100 +
            "`\nWhich is approximately equal to " +
            dabs.currencyEmoji +
            " **| " +
            toFancyNum(parseInt(((serverVal * pct) / 100) * 1500000)) +
            `** ${dabs.currencyName}!`
        )
      : msg.send(
          "Server total value is: `" +
            serverVal +
            "`\n" +
            "Which is approximately equal to " +
            dabs.currencyEmoji +
            " **| " +
            toFancyNum(serverVal * 1500000) +
            `** ${dabs.currencyName}!`
        );
    /* if (amount > parseInt(msg.member.settings.points))
      return msg.send("You can't bet more than what you have!");
    const flipped = this.client.utils.random(["Heads", "Tails"]);
    if (flipped === "Tails") {
      msg.send(`You won ${amount * 2} dabs `);
      msg.member.takePoints(amount);
      msg.member.takePoints(amount * 2);
    } else {
      msg.send(`You Loss ${amount}`);
      msg.member.takePoints(amount);
    }
    return msg.send(`The coin landed on \`${flipped}\` `); */
  }
}

module.exports = ServerValue;
