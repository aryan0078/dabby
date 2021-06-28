const Command = require("../../structures/Command.js");
const { toFancyNum } = require("../../utils/constants.js");

class DabFlowCommand extends Command {
  constructor(...args) {
    super(...args, {
      description: "Check total dabby flow",
      ownerOnly: true,
      usage: "dab flow",
      aliases: ["flow"],
    });
  }

  async run(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    //let cash = await u.find().toArray();
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

    flow.toArray().then((result) => {
      msg.send(
        `Total **${toFancyNum(
          result[0].points
        )}** <:dabs:851218687255773194> in flow`
      );
    });
  }
}

module.exports = DabFlowCommand;
