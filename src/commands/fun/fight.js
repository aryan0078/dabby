const Command = require("../../structures/Command.js");

const random = require("random-number-csprng");
const { toFancyNum, replyError } = require("../../utils/constants.js");
const { getCurrency, getCurrencyBalance, withdrawBalance } = require("../../structures/database.js");
const { MessageActionRow, MessageButton } = require("discord-buttons");
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
        return msg.send('Coming soon....')
        try {
            //let con=p.con

            var flaps = await getCurrency(msg.guild.id, db);;
            flaps = '<:dabs:851218687255773194> dabs';

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
                new MessageButton()
                    .setLabel("Accept")
                    .setStyle("green")

                    .setID(`accept:${member.id}:${amount}:${msg.author.id}`)





            }
        } catch (e) {
            console.log(e)
            msg.send(
                `${await this.badge(msg)} **| ${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''} |** I guess you dont have enough ${flaps} use **dab convert <amount>** to convert your dabs`
            );
        }
    }
}

module.exports = Coin;
