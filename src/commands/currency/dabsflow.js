const Command = require("../../structures/Command.js");
const { dabbyflowchart } = require("../../structures/database.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");

class DabFlowCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Check total dabby flow",
      ownerOnly: false,
      cooldown: 20,
      usage: "dab flow",
      aliases: ["flow",  "df",  "dabflow"],
    });
  }

  async run(msg) {
    if (await this.workercheck(msg)) {
      let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    //let cash = await u.find().toArray();
    let dabs = await db.collection("currencyFlow");
    
    let flow = 0;

    flow = await u.aggregate([
      {
        $group: {
          _id: null,
          points: {
            $sum: "$points",
          },
        },
      },
    ]);
    let url = await dabbyflowchart("f", 3, db);
    flow.toArray().then((result) => {
      dabs.insertOne({ flow: result[0].points, at: new Date() });

      msg.send(url);
      msg.send(
        `Total **${toFancyNum(
          result[0].points
        )}** <:dabs:851218687255773194> in flow`
      );
    });
    } else {
      return replyError(msg, 'This command is only for partners,owners,workers', 5000)
    }
  }
}

module.exports = DabFlowCommand;
