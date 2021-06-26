const Command = require("../../structures/Command.js");
const {
  database,
  getPools,
  addPool,
  chart,
} = require("../../structures/database.js");
const { getCurrency } = require("../../structures/database.js");
const serverValue = require("../../structures/servervalue.js");
const { poolValue, toFancyNum } = require("../../utils/constants.js");

class ListPools extends Command {
  constructor(...args) {
    super(...args, {
      description: "List Pools",
      extendedHelp: "You can list pools to invest in this command",
      usage: "dab pools id",

      aliases: ["pools", "p", "lp"],
    });
  }

  async run(msg, pool) {
    let pools = await getPools();
    let str = `>>> **${msg.author.username} |** Current pools for dabs <:dabs:851218687255773194> investments, \n\n`;
    let db = await database();
    let poolData = await db.collection("poolData");
    msg.send(await chart("Pool Graph", "f", poolData));
    pools.forEach((p, index) => {
      poolData.insertOne({ priceQuote: poolValue(p), at: new Date() });
      str += `Pool id **(${index + 1})**: ${p.poolName} with **${
        p.users.length
      }** users value of pool is <:dabs:851218687255773194> **${toFancyNum(
        poolValue(p)
      )} dabs !** \n`;
    });
    str +=
      "\nTo invest in the pool **`dab ip {amount} (poolid)`** \nTo withdraw from pool **`dab wp {amount} (poolid)`**";

    return msg.send(str);
  }
}

module.exports = ListPools;
