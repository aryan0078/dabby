const { database } = require("../structures/database.js");
const Event = require("../structures/Event.js");

class GuildCreate extends Event {
  async run(guild) {
    if (!guild.available) return;

    const channel = this.client.channels.cache.get("844990398698094592");

    if (!guild.owner && guild.ownerID) await guild.members.fetch(guild.ownerID);

    // If it exists in the settings then definitely an unavailable guild came back.
    const exists = this.client.settings.guilds.cache.has(guild.id);

    const embed = this.client
      .embed()
      .setTitle(
        exists ? "An unavailable guild came back" : "Dabby joined a new server!"
      )
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .addField("Owner", guild.owner.user.tag)
      .addField("Member Count", guild.memberCount)
      .setFooter(guild.id);

    if (this.client.user.settings.guildBlacklist.includes(guild.id)) {
      embed.setFooter(guild.id + " | Blacklisted");
      await guild.leave();
    }
    
    if (channel) await channel.send({ embed }).catch(() => null);

    const join = guild.channels.cache.find((c) => c.type === "text" && c.postable);
    if (!join) return;
  
    let db = this.client.dbClient;
    db = await db.db();
    let server = db.collection("guilds");
    let checkexist = await server.findOne({ id: guild.id });
    if (!checkexist) {
      await server.insertOne({
        id: guild.id,

        currencyEmoji: "<:servercoin:860947979615338516>",
        currencyName: guild.name + " coins",
        cryptoEnabled: true,
      });
      
    }

    guild.owner.send([
      ">>> **Hey there, thanks for inviting me in to this wonderful server " + guild.name,
      `Start by typing \`${guild.prefix} help\` to get a list of commands`,
      "Use dab help to get a list of commands",
      "Use dab stc to set server currency `dab sti {currencyName} {curencyEomji}`",
      `Note: levelup messages are enabled by default if you found them annoying feel free to disable it using \`${guild.prefix} levelup disable\``,
      "",
      `If you still have any questions ask them in our server, use \`${guild.prefix} support\``,
      "",
      "Have a great day!**", ,
    ].join("\n"))
    return join
      
      .send(
        
        [
          ">>> **Hey there, thanks for inviting me in to this wonderful server " + guild.name,
              `Start by typing \`${guild.prefix} help\` to get a list of commands`,
              "Use dab help to get a list of commands",
              "Use dab stc to set server currency `dab sti {currencyName} {curencyEomji}`",
              `Note: levelup messages are enabled by default if you found them annoying feel free to disable it using \`${guild.prefix} levelup disable\``,
              "",
              `If you still have any questions ask them in our server, use \`${guild.prefix} support\``,
              "",
          "Have a great day!**", ,
            ].join("\n")
      
      )
      
      .catch(() => null);
  }
}

module.exports = GuildCreate;
