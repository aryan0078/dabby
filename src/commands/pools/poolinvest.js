const Command = require("../../structures/Command.js");
const { addStake, checkStaked } = require("../../structures/database.js");

const {

  replyError,
  toFancyNum,
} = require("../../utils/constants.js");

class InvestPools extends Command {
  constructor(...args) {
    super(...args, {
      description: "List Pools",
      extendedHelp: "You can list pools to invest in this command",
      usage: "dab pools id",

      aliases: ["invp", "invest", "investpool", "ip"],
    });
  }

  async run(msg, pool) {
    if (pool.length <= 0) {
      return msg.send(
        "Please enter a pool id \n if you want to know pool id type dab pools"
      );
    }
    let db = this.client.dbClient;
    db = await db.db();

    let amount = parseInt(pool[0]) ? parseInt(pool[0]) : parseInt(pool[1]);
    let id = parseInt(pool[1]) ? parseInt(pool[1]) : parseInt(pool[2]);
    if (!id || !amount) {
      return replyError(
        msg,
        ", invalid arguments supplied correct one id dab ip `amount` `poolid`",
        4000
      );
    }
    if (amount > msg.member.settings.points) {
      return replyError(msg, ", you don't have enough dabs to stake", 3000);
    }
    let check = await checkStaked(id, msg.author.id, db);
    if (check) {
      return msg.send(
        `**${msg.author.username} |** You have already staked your <:dabs:851218687255773194> dabs  in the pool please type **dab getpool poolid amount**`
      );
    }

    let stake = await addStake(id, msg.author.id, amount, false, db);

    if (stake == 1) {
      msg.member.takePoints(amount);
      return msg.send(
        `**${msg.author.username} | **You Successfully staked your <:dabs:851218687255773194> ` +
          toFancyNum(amount) +
          ` dabs in pool **(` +
          id +
          ")**"
      );
    }
  }
}

module.exports = InvestPools;
