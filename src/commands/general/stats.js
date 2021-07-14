const Command = require("../../structures/Command.js");
const { version } = require("discord.js");
const { database } = require("../../structures/database.js");

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      description: "View bot statistics and information.",
      aliases: ["info"]
    });
  }

  async run(msg) {
    const { client } = this; // Avoid typing a lot of 'this'

    const cmd = Object.entries(this.client.user.settings.commands).sort(
      (x, y) => (x[1] < y[1] ? 1 : -1)
    );
    const mostUsed = cmd.length ? `${cmd[0][0]} (${cmd[0][1]} times)` : "None";
    const uptime = this.client.utils.getDuration(client.uptime);
    let db = this.client.dbClient;
    db = await db.db();
    
    let users_ = await db.collection("members").countDocuments();
    return msg.send(`${await this.badge(msg)}  Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, {
      embed: this.client
        .embed(this.client.user)
        .setColor("#7289DA")
        .setAuthor("Stats", msg.author.displayAvatarURL())
        .setTitle(msg.language.get("COMMAND_STATS_TITLE"))
        .setDescription(msg.language.get("COMMAND_STATS_DESCRIPTION"))
        .addField(
          msg.language.get("COMMAND_STATS_FIELD"),
          [
            `**Servers:** ${client.guilds.cache.size}`,
            `**Users:** ${users_}`,
            `**Channels:** ${client.channels.cache.size}`,
            `**Uptime:** ${uptime}`,
            `**Total Memory Usage:** ${(
              process.memoryUsage().heapTotal /
              1024 /
              1024
            ).toFixed(2)} MB`,
            `**Memory Usage:** ${(
              process.memoryUsage().heapUsed /
              1024 /
              1024
            ).toFixed(2)} MB`,
          ].join("\n")
        )

        .addField(
          "Command Stats",
          [
            `**Total Commands:** ${this.store.size}`,
            `**Commands Ran:** ${this.store.ran}`,
            `**Most Used:** ${mostUsed}`,
          ].join("\n")
        ),
    });
  }
}

module.exports = Stats;
