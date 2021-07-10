const Command = require("../../structures/Command.js");
const { getCurrency, topleaderboard } = require("../../structures/database.js");
const { replyError } = require("../../utils/constants.js");
class Leaderboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "View the server leaderboard.",
      usage: "leaderboard [page]",
      guildOnly: true,
      aliases: ["lb", "top"]
    });
  }

  async run(msg, [args, page]) {
    //page = this.verifyInt(page, 1);
    let db = this.client.dbClient;
    db = await db.db();
    if (!args) {
      return replyError(msg, 'What do you want to see gloabl or server please type it with the command', 7000)
    }
    var rows = "";
    if (args == "server") {
      msg.guild.members.fetch().then(async (fetchedMembers) => {
        let sorted = []
        fetchedMembers.forEach(element => {
          let u = this.verifyMember(msg, element)
          sorted.push({ id: u.id, points: u.points })
        });
        sorted.sort((a, b) => parseInt(b.points) - parseInt(a.points))
        const leaderboard = [];
        const top = sorted

        for (let i = 0; i < top.length; i++) {
          const u = top[i];
          try {

            const user = await this.client.users.fetch(u.id);
            leaderboard.push(
              `- [${i + 1}] ❯ ${user.tag
              }\n    => ${parseInt(u.points).toLocaleString()} dabs`
            );
          } catch (error) {
            console.log(error)
          }

        }


        const pos = sorted.findIndex(user => user.id === msg.author.id);
        const posTxt = pos == -1 ? "??" : (sorted.findIndex(user => user.id === msg.author.id) + 1).toString().padStart(2, "0");
        leaderboard.push(
          `\n+ [${posTxt}] ❯ ${msg.author.tag}\n    => ${parseInt(
            msg.member.settings.points
          ).toLocaleString()} dabs`
        );
        return msg.send(`Leaderboard\n\`\`\`\n${leaderboard.join("\n")}\`\`\``);
      })
    } else if (args == "global") {
      /*  if (args == "global") {
         rows = await this.client.settings.members
           .find({ $query: {}, $orderby: { points: -1 } }).limit(20)
           .toArray();
       } else if (args == "server" || args == "guild") {
         rows = await this.client.settings.members
           .find({ id: { $regex: `^${msg.guild.id}` } }, { sort: { points: -1 } })
           .toArray();
       }

      if (rows.length === 0) return msg.send("There is no leaderboard in this server, maybe its a dead place???");

      const totalPages = Math.max(Math.round(rows.length / 10), 1);

      page -= 1;

      if (page > totalPages && !totalPages) return msg.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);
      if (totalPages && page + 1 > totalPages) return msg.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);

      const positions = rows.map((row) => row.id.split(".")[1]);
      */

      const leaderboard = [];
      const top = await topleaderboard('param', db)

      for (let i = 0; i < top.length; i++) {
        const u = top[i];
        try {

          const user = await this.client.users.fetch(u.id);
          leaderboard.push(
            `- [${i + 1}] ❯ ${user.tag
            }\n    => ${parseInt(u.points).toLocaleString()} dabs`
          );
        } catch (error) {
          console.log(error)
        }

      }
    
    
      const pos = top.findIndex(user => user.id === msg.author.id)
      const posTxt = pos == -1 ? "∞" : (top.findIndex(user => user.id === msg.author.id) + 1).toString().padStart(2, "0");
      leaderboard.push(
        `\n+ [${posTxt}] ❯ ${msg.author.tag}\n    => ${parseInt(
          msg.member.settings.points
        ).toLocaleString()} dabs`
      );
      return msg.send(`Leaderboard\n\`\`\`\n${leaderboard.join("\n")}\`\`\``);
    }
  }
}

module.exports = Leaderboard;
