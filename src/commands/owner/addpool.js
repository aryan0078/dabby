const Command = require("../../structures/Command.js");
const { addPool } = require("../../structures/database.js");

class AddPool extends Command {
  constructor(...args) {
    super(...args, {
      description: "Adds pool",
      ownerOnly: true,
      usage: "add pool",
    });
  }

  async run(msg) {
    await addPool();
    msg.send("Pool Added");
  }
}

module.exports = AddPool;
