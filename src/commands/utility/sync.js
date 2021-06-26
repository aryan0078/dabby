const Command = require("../../structures/Command.js");
const { cloudSync, database } = require("../../structures/database.js");

class Sync extends Command {
  constructor(...args) {
    super(...args, {
      description: "DMs someone",

      usage: "dm <user> <msg...>",
      aliases: ["pm"],
      cooldown: 5,
    });
  }

  async run(msg) {
    if (msg.author.id == "741908851363938364") {
      msg.send("Sync process started!");

      let cloud = await cloudSync();
      let users = cloud.collection("users");
      let client = cloud.collection("client");
      let guilds = cloud.collection("guilds");
      let members = cloud.collection("members");
      let pools = cloud.collection("pools");
      let store = cloud.collection("store");
      let poolData = cloud.collection("poolData");
      let local = await database();

      let l_users = local.collection("users");
      let l_client = local.collection("client");
      let l_guilds = local.collection("guilds");
      let l_members = local.collection("members");
      let l_pools = local.collection("pools");
      let l_store = local.collection("store");
      let l_poolData = local.collection("poolData");

      (await l_users.find().toArray()).forEach((user) => {
        users.insertOne(user);
      });
      (await l_client.find().toArray()).forEach((user) => {
        client.insertOne(user);
      });
      (await l_guilds.find().toArray()).forEach((user) => {
        guilds.insertOne(user);
      });
      (await l_members.find().toArray()).forEach((user) => {
        members.insertOne(user);
      });
      (await l_pools.find().toArray()).forEach((user) => {
        pools.insertOne(user);
      });
      (await l_store.find().toArray()).forEach((user) => {
        store.insertOne(user);
      });
      (await l_poolData.find().toArray()).forEach((user) => {
        poolData.insertOne(user);
      });
    }
    msg.send("Sync done");
  }
}

module.exports = Sync;
