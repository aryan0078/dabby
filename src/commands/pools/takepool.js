const Command = require("../../structures/Command.js");
const {
  database,
  getPools,
  addPool,
  addStake,
  withdrawAmount,
  checkStaked,
} = require("../../structures/database.js");
const { getCurrency } = require("../../structures/database.js");
const serverValue = require("../../structures/servervalue.js");
const {
  poolValue,
  replyError,
  toFancyNum,
} = require("../../utils/constants.js");

class TakePool extends Command {
  constructor(...args) {
    super(...args, {
      description: "Withdraw your money from Pools",
      extendedHelp: "You can withdraw money from pools by this command",
      usage: "dab takepool amount poolid",

      aliases: ["take", "withdraw", "wp", "get"],
    });
  }

  async run(msg, pool) {
    if (pool.length <= 0) {
      return msg.send(
        "Please enter a pool id \n if you want to know pool id type dab pools"
      );
    }
    let amount = parseInt(pool[0]) ? parseInt(pool[0]) : parseInt(pool[1]);
    let id = parseInt(pool[1]) ? parseInt(pool[1]) : parseInt(pool[2]);
    if ((!id || !amount) && amount != "all") {
      return replyError(
        msg,
        ", invalid arguments supplied correct one id dab tp `amount` `poolid`",
        4000
      );
    }
    let dabs = await getCurrency(msg.guild.id);
    let check = await checkStaked(id, msg.author.id);
    if (!check) {
      return msg.send(
        `You haven't staked dabs in the pool **(${id})** to invest **dab ip amount poolid**`
      );
    }
    amount == "all" ? (amount = check.amount) : amount;
    if (amount > check.amount) {
      return replyError(
        msg,
        ", you don't have enough dabs to withdraw this amount in pool you have <:dabs:851218687255773194> **" +
          toFancyNum(check.amount) +
          `** dabs!`,
        4000
      );
    }

    let poolMultiplier = Math.round(
      await withdrawAmount(id, msg.author.id, amount)
    );
    let stake = await addStake(id, msg.author.id, amount, true);
    if (stake == 1) {
      msg.member.givePoints(poolMultiplier);
      return msg.send(
        `**${msg.author.username} |** You Successfully unstaked your <:dabs:851218687255773194> **` +
          amount +
          `** dabs in pool **(` +
          id +
          `)** you will get total of <:dabs:851218687255773194> **${toFancyNum(
            poolMultiplier
          )}** dabs!`
      );
    }
  }
}

module.exports = TakePool;
