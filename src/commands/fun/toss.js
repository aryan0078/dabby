const Command = require("../../structures/Command.js");

const random = require("random-number-csprng");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const { getCurrency, getCurrencyBalance, withdrawBalance } = require("../../structures/database.js");
class Coin extends Command {
  constructor(...args) {
    super(...args, {
      description: "Flip a coin.",
      extendedHelp: "You can bet on what it will land on.",
      usage: "coin [tails|heads]",
      cooldown: 10,
      aliases: ["coinflip", "flipcoin", "flip", "cf", "f", "toss", "ts"],
    });
  }

  async run(msg, args) {
    let db = this.client.dbClient;
    db = await db.db();
    try {
      //let con=p.con

      var flaps = await getCurrency(msg.guild.id,  db);;
      flaps = '<:dabs:851218687255773194> dabs';
      const spin = "<a:flip:857700086728884264>";
      const heads = "<:coin:849002406124716113>";
      const tails = "<:coin:849002406124716113>";
      const maxBet = 40000;
      //Syntax Checkdd
      let bet = 1,
        arg1 = args[0];
      if (parseInt(arg1)) {
        bet = parseInt(arg1);
        arg1 = args[1];
      } else if (arg1 && arg1.toLowerCase() == "all") {
        bet = "all";
        arg1 = args[1];
      } else if (parseInt(args[1])) {
        bet = parseInt(args[1]);
      } else if (args[1] && args[1].toLowerCase() == "all") {
        bet = "all";
      } else if (args.length != 1) {
        replyError(msg, ", Invalid arguments!!", 3000);

        return;
      }

      //Get user choice
      let choice = "h";
      if (arg1 != undefined) arg1 = arg1.toLowerCase();
      if (arg1 == "heads" || arg1 == "h" || arg1 == "head") choice = "h";
      else if (arg1 == "tails" || arg1 == "t" || arg1 == "tail") choice = "t";

      //Final syntax check
      if (bet == 0) {
        replyError(msg, ", You can't bet 0 dum dum!", 3000);

        return;
      } else if (bet < 0) {
        replyError(msg, ", Do you understand how dabs works..", 3000);

        return;
      } else if (choice == undefined) {
        replyError(msg, ", You must choose either `heads` or `tails`!", 3000);

        return;
      }

      let result = msg.member.settings.points;
      if (
        result == undefined ||
        result == 0 ||
        (bet != "all" && result < bet)
      ) {
        replyError(
          msg,
          "**🚫 | " +
            msg.author.username +
          `**, You don't have enough ${flaps} !`,
          3000
        );
        return;
      } else {
        if (bet == "all") bet = result;

        if (maxBet && bet > maxBet) {
          bet = maxBet;
        } else if (bet <= 0) {
          replyError(
            msg,
            `, you don't have any ${flaps} silly!`,
            3000
          );

          return;
        }

        let rand = await random(0, 1);
        let percentage = 2;
        let win = false;
        //tails
        if (rand == 0 && choice == "t") win = true;
        //heads
        else if (rand == 1 && choice == "h") win = true;

        result = result;
        msg.member.takePoints(bet)
        let text = `${await this.badge(msg)} | **` + msg.member.displayName + `** ${await this.beta(msg) ? this.betaemoji : ''}` + " spent **" + toFancyNum(bet) + " " + flaps + "** and chose " + (choice == "h" ? "**heads**" : "**tails**");
        let text2 = text;
        text2 +=
          "\nThe coin spins... " +
          (win
            ? choice == "h"
              ? heads
              : tails
            : choice == "h"
            ? tails
            : heads) +
          " and you ";
        if (win) {
          text2 += "won **" + toFancyNum(bet * percentage) + " " + flaps + "**!!";
        } else text2 += "lost it all... :c";
        text += "\nThe coin spins... " + spin;
        win
          ? msg.member.givePoints(bet * percentage)
          : null;
        let message = await msg.send(text);
        setTimeout(function () {
          message.edit(text2);
        }, 2000);
      }
    } catch (e) {
      console.log(e)
      msg.send(
        `${await this.badge(msg)} **| ${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}  I guess you dont have enough ${flaps} use **dab convert <amount>** to convert your dabs`
      );
    }
  }
}

module.exports = Coin;
