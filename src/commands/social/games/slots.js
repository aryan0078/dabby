const Command = require("../../../structures/Command.js");
const { alter } = require("../../../structures/alterSlot.js");
const { replyError, toFancyNum } = require("../../../utils/constants.js");
const {getCurrency, getCurrencyBalance, withdrawBalance} =require("../../../structures/database.js");
const random = require("random-number-csprng");
const slots = require("../../../utils/slots.js");
const { MessageEmbed } = require("discord.js");

class Slots extends Command {
  constructor(...args) {
    super(...args, {
      description: "Try your luck in the slot machine!",
      aliases: ["slot", "slotmachine", "slot-machine"],
      guildOnly: true,
      category: "Fun",
      cooldown: 13,
    });
  }

  async run(msg, amt) {
     let db = this.client.dbClient;
     db = await db.db();
    let dabs = await getCurrency(msg.guild.id, db);
    let loosembed = new MessageEmbed().setImage('https://i.pinimg.com/originals/9a/f1/4e/9af14e0ae92487516894faa9ea2c35dd.gif');
    let winembed = new MessageEmbed().setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDzctc2vB6zNct-3XZRcMyZI22HmBg2ThZIL4qJl9kLcubx29GhjOZQ1oRfAAukxkmvsM&usqp=CAU')
    try {


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

    let result = await getCurrencyBalance(msg.author.id, msg.guild.id, db);

    if (all && result.amount != undefined) amount = result.amount;
    if (maxBet && amount > maxBet) amount = maxBet;
    if (
      result.amount == undefined ||
      result.amount < amount ||
      result.amount <= 0
    ) {
      replyError(
        msg,
        "**🚫 | " +
          msg.author.username +
          `**, You don't have enough ${dabs.currencyEmoji} ${dabs.currencyName}!`,
        3000
      );
    } else {
      //Decide results
     
      let rslots = [];
      let rand = await random(2, 5);
      let win = 0;
      let logging = 0;

      let dabs = await getCurrency(msg.guild.id, db);
      let embed = new MessageEmbed().setImage('https://cdn.dribbble.com/users/1648363/screenshots/3581559/slotmachine.gif')
      msg.send(`**${msg.author.username}** bet ${toFancyNum(amount)} ${dabs.currencyEmoji} ${dabs.currencyName}`, { embed: embed }).then(m => {
        setTimeout(async () => {
          if (rand == 4) {
            win = 4
          }
          await withdrawBalance(
            msg.author.id,
            msg.guild.id,
            win === 4 ? parseInt(amount * 1.5) : -amount,
            false,
            db
          );
          win == 4 ? m.edit(`**${msg.author.username}** bet ${toFancyNum(amount)} ${dabs.currencyEmoji} ${dabs.currencyName} and won ${toFancyNum(amount * 2)}`, { embed: loosembed }) : m.edit(`**${msg.author.username}** bet ${toFancyNum(amount)} ${dabs.currencyEmoji} ${dabs.currencyName}\n and lost.`, { embed: winembed })

        }, 3000)
      })







    }
  } catch (e) {
      console.log(e)
      msg.send(
        `I guess you dont have enough ${dabs.currencyEmoji} ${dabs.currencyName} use dab convert <amount> to convert your dabs`
      );
    
    }
	
	
   
  }
}

module.exports = Slots;
