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
    let winingembeds = ['https://cdn.discordapp.com/attachments/864939236183375942/864939279532818462/w1.gif', 'https://cdn.discordapp.com/attachments/864939236183375942/864939460634083379/w2.gif', 'https://cdn.discordapp.com/attachments/864939236183375942/864939654623920188/w3.gif', 'https://cdn.discordapp.com/attachments/864939236183375942/864939836984262706/w4.gif']

    let loosembed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864940776172814396/864945374145544202/wasted.gif');
    let winembed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864940776172814396/864945639795327056/winner.gif')
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
      let rand = await random(4, 6);
      let percentage = 2;
      let win = 0;
      let logging = 0;

      let dabs = msg.member.takePoints(amount);
      let embed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/864939847943847956/864940129650868294/l1.gif')
      msg.send(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} bet **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs`, { embed: embed }).then(m => {
        setTimeout(async () => {
          if (rand == 4) {
            win = 4;
            msg.member.givePoints(amount * percentage);
          }

          win == 4 ? m.edit(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} bet **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs and won **${toFancyNum(parseInt(amount * percentage))}** <:dabs:851218687255773194> dabs`, { embed: winembed }) : m.edit(`**${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''} bet **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs \n and lost.`, { embed: loosembed })

        }, 5000)
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
