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
     
      let rslots = [];
      let rand = await random(3, 5);
      let percentage = await random(1, 3)
      let win = 0;
      let logging = 0;

      let dabs = msg.member.takePoints(amount);
      let embed = new MessageEmbed().setImage('https://cdn.dribbble.com/users/1648363/screenshots/3581559/slotmachine.gif')
      msg.send(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} bet **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs`, { embed: embed }).then(m => {
        setTimeout(async () => {
          if (rand == 4) {
            win = 4;
            msg.member.givePoints(amount * percentage);
          }

          win == 4 ? m.edit(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} bet **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs and won **${toFancyNum(parseInt(amount * percentage))}** <:dabs:851218687255773194> dabs`, { embed: loosembed }) : m.edit(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} bet **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs \n and lost.`, { embed: winembed })

        }, 3000)
      })







    }
  } catch (e) {
      console.log(e)
      msg.send(
        `I guess you dont have enough <:dabs:851218687255773194> dabs or you are new use dab cash for signup`
      );
    
    }
	
	
   
  }
}

module.exports = Slots;
