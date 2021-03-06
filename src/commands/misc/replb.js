const Command = require("../../structures/Command.js");


class RepLB extends Command {
  constructor(...args) {
    super(...args, {
      description: "View top people with most reputations.",
      aliases: ["repleaderboard", "reputationleaderboard", "reputationlb"]
    });
  }

  async run(msg) {
    const rows = await this.client.settings.users.find({ reputation: { $gt: 0 } }, { sort: { reputation: -1 }, limit: 20 }).toArray();

    if(!rows.length) return msg.send("Looks like no one has any reputations.");

    const embed = this.client
      .embed()
      .setTitle(
        `Top${rows.length === 1 ? "" : ` ${rows.length}`} respected user${
          rows.length > 1 ? "s" : ""
        } by reputations`
      )
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setColor("#7289DA")
      .setFooter(
        `Give reputation to users via ${msg.guild.settings.prefix}rep @user to help them climb the leaderboard.`
      );

    const lb = [];
    lb.push('\`\`\`\n')
    for(let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const user = await this.client.users.fetch(row.id);
      lb.push(`${((i + 1).toString()).padEnd(2, " ")} ❯ ${user.tag} --> ${row.reputation}`);
    }
    lb.push('\n\`\`\`')
    embed.setDescription(lb.join("\n"));

    return msg.send(`${await this.badge(msg)}  Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, { embed: embed });
  }
}

module.exports = RepLB;
