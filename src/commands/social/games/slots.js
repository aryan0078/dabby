const Command = require("../../../structures/Command.js");
const { alter } = require("../../../structures/alterSlot.js");
const { replyError, toFancyNum } = require("../../../utils/constants.js");
const {getCurrency, getCurrencyBalance, withdrawBalance} =require("../../../structures/database.js");
const random = require("random-number-csprng");
const slots = require("../../../utils/slots.js");

class Slots extends Command {
  constructor(...args) {
    super(...args, {
      description: "Try your luck in the slot machine!",
      aliases: ["slot", "slotmachine", "slot-machine"],
      guildOnly: true,
      category: "Fun",
      cooldown: 10,
    });
  }

  async run(msg, amt) {
     let db = this.client.dbClient;
     db = await db.db();
     let dabs = await getCurrency(msg.guild.id, db);
  try{
    const slots = [
      "<:eggplant:417475705719226369>",
      "<:heart:417475705899712522>",
      "<:cherries:851517165865795654>",

      "<a:box_shake:849188341361934336>",
      "<a:giveaway:847872806938345472>",
    ];
    const moving = "<a:slotmoving:851520573414965299>";
    const maxBet = 80000;
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
      let rand = (await random(1, 1000)) / 10;
      let win = 0;
      let logging = 0;
      if (rand <= 20) {
        //1x 20%
        win = amount ;
        rslots.push(slots[0]);
        rslots.push(slots[0]);
        rslots.push(slots[0]);
        logging = 0;
      } else if (rand <= 40) {
        //2x 20%
        win = amount ;
        rslots.push(slots[1]);
        rslots.push(slots[1]);
        rslots.push(slots[1]);
        logging = 1;
      } else if (rand <= 45) {
        //3x 5%
        win = amount ;
        rslots.push(slots[2]);
        rslots.push(slots[2]);
        rslots.push(slots[2]);
        logging = 2;
      } else if (rand <= 47.5) {
        //4x 2.5%
        win = amount ;
        rslots.push(slots[3]);
        rslots.push(slots[3]);
        rslots.push(slots[3]);
        logging = 3;
      } else if (rand <= 48.5) {
        //10x 1%
        win = amount ;
        rslots.push(slots[4]);
        rslots.push(slots[5]);
        rslots.push(slots[4]);
        logging = 9;
      } else {
        logging = -1;
        var slot1 = Math.floor(Math.random() * (slots.length - 1));
        var slot2 = Math.floor(Math.random() * (slots.length - 1));
        var slot3 = Math.floor(Math.random() * (slots.length - 1));
        if (slot3 == slot1)
          slot2 =
            (slot1 + Math.ceil(Math.random() * (slots.length - 2))) %
            (slots.length - 1);
        if (slot2 == slots.length - 2) slot2++;
        rslots.push(slots[slot1]);
        rslots.push(slots[slot2]);
        rslots.push(slots[slot3]);
      }
      let dabs = await getCurrency(msg.guild.id, db);

      let winmsg =
        win == 0
          ? "nothing... :c"
          : ` **${dabs.currencyEmoji} ${dabs.currencyName}**` +
            toFancyNum(win * 2);
      await withdrawBalance(
        msg.author.id,
        msg.guild.id,
        win === 0 ? -amount : win,
        false,
        db
      );
      result = await getCurrencyBalance(msg.author.id, msg.guild.id, db);

      //Display slots
      let machine =
        "**`___SLOTS___`**\n" +
        moving +
        " " +
        moving +
        " " +
        moving +
        "    " +
        msg.author.username +
        ` bet **${dabs.currencyEmoji} ${dabs.currencyName}**` +
        toFancyNum(amount) +
        "\n`|         |`\n`|         |`";

      machine = alter(msg.author.username.id, machine);
      let message = await msg.send(machine);
      setTimeout(async function () {
        machine =
          "**`___SLOTS___`**\n" +
          rslots[0] +
          " " +
          moving +
          " " +
          moving +
          "    " +
          msg.author.username +
          ` bet **${dabs.currencyEmoji} ${dabs.currencyName}**` +
          toFancyNum(amount) +
          "\n`|         |`\n`|         |`";
        machine = alter(msg.author.username.id, machine);
        await message.edit(machine);
        setTimeout(async function () {
          machine =
            "**`___SLOTS___`**\n" +
            rslots[0] +
            " " +
            moving +
            " " +
            rslots[2] +
            "    " +
            msg.author.username +
            ` bet **${dabs.currencyEmoji} ${dabs.currencyName}**` +
            toFancyNum(amount) +
            "\n`|         |`\n`|         |`";
          machine = alter(msg.author.username.id, machine);
          await message.edit(machine);
          setTimeout(async function () {
            machine =
              "**`___SLOTS___`**\n " +
              rslots[0] +
              " " +
              rslots[1] +
              " " +
              rslots[2] +
              "    **" +
              msg.author.username +
              `** bet **${dabs.currencyEmoji} ${dabs.currencyName}**` +
              toFancyNum(amount)+
               
              "\n`|         |`  and won " +
              winmsg +
              "\n`|         |`";
            machine = alter(msg.author.username.id, machine);
            message.edit(machine);
          }, 1000);
        }, 700);
      }, 1000);
    }
  } catch (e) {
    
      msg.send(
        `I guess you dont have enough ${dabs.currencyEmoji} ${dabs.currencyName} use dab convert <amount> to convert your dabs`
      );
    
    }
	
	
   
  }
}

module.exports = Slots;
