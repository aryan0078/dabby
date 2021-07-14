const Command = require("../../../structures/Command.js");
const { alter } = require("../../../structures/alterSlot.js");
const { replyError, toFancyNum } = require("../../../utils/constants.js");
const { getCurrency, getCurrencyBalance, withdrawBalance, randomUser, givedabs } = require("../../../structures/database.js");
const random = require("random-number-csprng");
const slots = require("../../../utils/slots.js");
const { MessageEmbed } = require("discord.js");

class Slots extends Command {
    constructor(...args) {
        super(...args, {
            description: "Race against random opponent",
            aliases: ["race", "carrace", "crace"],
            guildOnly: true,
            category: "Fun",
            cooldown: 13,
        });
    }

    async run(msg, amt) {
        let db = this.client.dbClient;
        db = await db.db();
        let dabs = await getCurrency(msg.guild.id, db);
        let carrace = 'https://cdn.discordapp.com/attachments/864952156033253416/864956553685630986/race.gif'
        try {
            let random_user = await randomUser(db);

            let ran_mem = await this.verifyUser(msg, random_user.id);


            const maxBet = 40000;
            let args = amt;

            //Check arguments
            let amount = 0;
            let all = false;

            if (args.length == 0) amount = 1;
            else if (parseInt(args[0]) && args.length == 1) amount = parseInt(args[0]);
            else if (args.length == 1 && args[0] == "all") all = true;
            else {
                replyError(msg, ", Invalid arguments!! >:c", 3000);

                return;
            }

            if (amount == 0 && !all) {
                replyError(msg, ", uwu.. you can't bet 0 silly!", 3000);

                return;
            } else if (amount < 0) {
                replyError(msg, ", that... that's not how it works.", 3000);

                return;
            }

            //Check if valid time and flaps

            let result = msg.member.settings.points;

            if (all && result != undefined) amount = result;
            if (maxBet && amount > maxBet) amount = maxBet;
            if (
                result == undefined ||
                result < amount ||
                result <= 0
            ) {
                replyError(
                    msg,
                    "**🚫 | " +
                    msg.author.username +
                    `**, You don't have enough <:dabs:851218687255773194> dabs!`,
                    3000
                );
            } else {
                //Decide results
                let winembed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864952156033253416/864963981176995840/winning.gif').setFooter(`${ran_mem.username} , Lost`)
                let loseembed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864952156033253416/864963999733121054/loosing.gif').setFooter(`${ran_mem.username} , Won ${toFancyNum(amount)}`)
                let rslots = [];
                let dmwon = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864952156033253416/864963981176995840/winning.gif').setFooter(`${ran_mem.username} , Won ${amount}`)
                let rand = await random(4, 6);
                let percentage = 2;
                let win = 0;
                let logging = 0;

                let dabs = msg.member.takePoints(amount);
                let embed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864952156033253416/864956553685630986/race.gif').setFooter(`${ran_mem.username} , Randomly joined against you`)
                msg.send(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} You Participated in the race for **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs `, { embed: embed }).then(m => {

                    setTimeout(async () => {
                        if (rand == 4) {
                            win = 4;
                            msg.member.givePoints(amount * percentage);
                        } else {
                            await givedabs(random_user.id, amount, db);
                            try {
                                await ran_mem.send(`** ${msg.author.username} ** ${await this.beta(msg) ? this.betaemoji : ''} Participated in the race for ** ${toFancyNum(amount)} ** <:dabs:851218687255773194> dabs \n and lost but you won **${toFancyNum(amount)}**\n use **dab race {amount}**\nExample-: dab race 100\nto race against random users`, { embed: dmwon });
                            } catch (er) {
                                console.log('Cant dm')
                            }
                        }

                        win == 4 ? m.edit(`** ${msg.author.username} ** ${await this.beta(msg) ? this.betaemoji : ''} You Participated in the race for ** ${toFancyNum(amount)} ** <:dabs:851218687255773194> dabs \n and won **${toFancyNum(amount * 2)}** <:dabs:851218687255773194> dabs`, { embed: winembed }) : m.edit(`** ${msg.author.username} ** ${await this.beta(msg) ? this.betaemoji : ''} You Participated in the race for ** ${toFancyNum(amount)} ** <:dabs:851218687255773194> dabs \n and lost...`, { embed: loseembed })

                    }, 7000)
                });








            }
        } catch (e) {
            console.log(e)
            msg.send(
                `**No opponent Found for race please race again**`
            );

        }



    }
}

module.exports = Slots;
