const Command = require("../../structures/Command.js");
const { getCurrency, topleaderboard } = require("../../structures/database.js");
const { replyError, toFancyNum } = require("../../utils/constants.js");
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
    if (!page || !parseInt(page) || page >= 26) {
      page = 10
    }
    let emojis = ['🥇', '🥈', '🥉']
    page = parseInt(page)
    db = await db.db();
    if (!args) {
      return replyError(msg, 'What do you want to see gloabl or server please type it with the command', 7000)
    }
    const date = new Date()
    var rows = "";
    let timestamp = `Timestamp :- ${date.toUTCString()}`
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


        if (i > 2) {
          if (i >= 9) {
            leaderboard.push(
              `- [${i + 1}] ❯ ${u.tag
              }\n    => ${toFancyNum(u.points)} dabs`
            );
          } else {
            leaderboard.push(
              `- [0${i + 1}] ❯ ${u.tag
              }\n    => ${toFancyNum(u.points)} dabs`
            );
          }

        } else {

          leaderboard.push(
            `- [${emojis[i]}] ❯ ${u.tag
            }\n    => ${toFancyNum(u.points)} dabs`
          );
        }



      }
      const pos = sorted.findIndex(user => user.id === msg.author.id)
      const posTxt = pos == -1 ? "∞" : (sorted.findIndex(user => user.id === msg.author.id) + 1).toString().padStart(2, "0");
      leaderboard.push(
        `\n+ [${posTxt}] ❯ ${msg.author.tag}\n      => ${parseInt(
          msg.member.settings.points
        ).toLocaleString()} dabs`
      );
      return msg.send(`Requested by **${msg.author.username}** \n\`\`\`\n🎖️ Top ${page} Dab Holders in ${msg.guild.name} Server\n\n${leaderboard.join("\n")}\n\n${timestamp}\n\`\`\``);




      // sorted.sort((a, b) => parseInt(b.points) - parseInt(a.points))


    } else if (args == "global") {


      const leaderboard = [];
      const top = await topleaderboard('param', page, db)

      for (let i = 0; i < top.length; i++) {
        const u = top[i];
        try {

          const user = await this.client.users.fetch(u.id);
          if (i > 2) {
            if (i >= 9) {
              leaderboard.push(
                `- [${i + 1}] ❯ ${user.tag
                }\n    => ${toFancyNum(u.points)} dabs`
              );
            } else {
              leaderboard.push(
                `- [0${i + 1}] ❯ ${user.tag
                }\n    => ${toFancyNum(u.points)} dabs`
              );
            }

          } else {

            leaderboard.push(
              `- [${emojis[i]}] ❯ ${user.tag
              }\n    => ${toFancyNum(u.points)} dabs`
            );
          }

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


      return msg.send(`Requested by **${msg.author.username}** \n\`\`\`\n🎖️ Globally Top ${page} Dab Holders \n\n${leaderboard.join("\n")}\n\n${timestamp}\n\`\`\``);
    }
  }
}

module.exports = Leaderboard;
