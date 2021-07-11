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
    if (!page || !parseInt(page) || page >= 25) {
      page = 10
    }
    db = await db.db();
    if (!args) {
      return replyError(msg, 'What do you want to see gloabl or server please type it with the command', 7000)
    }
    var rows = "";
    if (args == "server") {

      const leaderboard = [];
      var sorted = [];
      (await msg.guild.members.fetch()).filter(async (res) => {



        //let u = await this.verifyMember(msg, mem)
        sorted.push({ id: res.id, points: res.points, tag: res.user.username });



      });
      sorted.sort((a, b) => parseInt(b.points) - parseInt(a.points))
      for (let i = 0; i < page; i++) {
        const u = sorted[i];



        leaderboard.push(
          `- [${i + 1}] ❯ ${u.tag
          }\n    => ${parseInt(u.points).toLocaleString()} dabs`
        );


      }
      const pos = sorted.findIndex(user => user.id === msg.author.id)
      const posTxt = pos == -1 ? "∞" : (sorted.findIndex(user => user.id === msg.author.id) + 1).toString().padStart(2, "0");
      leaderboard.push(
        `\n+ [${posTxt}] ❯ ${msg.author.tag}\n    => ${parseInt(
          msg.member.settings.points
        ).toLocaleString()} dabs`
      );
      return msg.send(`**Top ${page} Ranking in server **\n\`\`\`\n${leaderboard.join("\n")}\`\`\``);




      // sorted.sort((a, b) => parseInt(b.points) - parseInt(a.points))


    } else if (args == "global") {


      const leaderboard = [];
      const top = await topleaderboard('param', page, db)

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
      return msg.send(`**Top ${page} Ranking in Global**\n\`\`\`\n${leaderboard.join("\n")}\`\`\``);
    }
  }
}

module.exports = Leaderboard;
