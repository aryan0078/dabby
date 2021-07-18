const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command.js");

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: "View help for commands.",
      usage: "help [command]",
    });
  }

  async run(msg, [command]) {
    if (command) {
      const cmd = this.store.get(command);
      if (!cmd)
        return msg.send(
          "That command does not exist! Why would you think I'd have such a thing?"
        );

      let cost = msg.tr("NONE");

      if (cmd.cost && msg.guild && msg.guild.settings.social) {
        const premium = await this.client.verifyPremium(msg.author);

        if (premium) {
          // Premium users get a 25% off the cost.
          cost = `${cmd.cost - Math.floor(cmd.cost / 2 / 2)}`;
        } else {
          cost = `${cmd.cost}`;
        }
      }

      if (cmd.nsfw && msg.guild && !msg.channel.nsfw)
        return msg.send(
          " You can't view details of that command in a non NSFW channel."
        );

      return msg.send("**Dabby Help**", {
        embed: new MessageEmbed()
          .setTitle(msg.tr("COMMAND_HELP_FOR", cmd.name))
          .setColor("#7289DA")
          .setFooter('Sponserd by ! HITESH BHOOTRA ᴴᴮ#7300')
          .setDescription(
            [
              `**${msg.tr("COMMAND_HELP_DESCRIPTION")}:** ${
                typeof cmd.description === "function"
                  ? cmd.description(msg)
                  : cmd.description
              }`,
              `**${msg.tr("COMMAND_HELP_CATEGORY")}:** ${cmd.category}`,
              `**Aliases:** ${
                cmd.aliases.length ? cmd.aliases.join(", ") : msg.tr("NONE")
              }`,
              `**Cooldown:** ${
                cmd.cooldown
                  ? cmd.cooldown + " " + msg.tr("SECONDS")
                  : msg.tr("NONE")
              }`,
              `**Usage:** ${msg.guild ? msg.guild.prefix : "m!"}${cmd.usage}`,
              `**Cost:** ${cost}`,
              `**Extended Help:** ${
                typeof cmd.extendedHelp === "function"
                  ? cmd.extendedHelp(msg)
                  : cmd.extendedHelp
              }`,
            ].join("\n")
          ),
      });
    }

    const map = {}; // Map<Category, Array<Command.Name>>
    for (const command of this.store.values()) {
      // Check for hidden commands first so if all commands in a category is hidden we won't even show the category.
      if (command.hidden) continue;
      if (command.ownerOnly && msg.author.id !== this.client.constants.ownerID)
        continue;
      if (command.nsfw && !msg.channel.nsfw) continue;

      // Try translating the category name.
      const category =
        msg.tr(`CATEGORY_${command.category.toUpperCase()}`) ||
        command.category;

      if (!map[category]) map[category] = [];
      map[category].push("`" + command.name + "`");
    }
const { link } = this.client.utils;
    const embed = new MessageEmbed()
  /*   \nJoin our " +
    link("[Discord Server]", "https://discord.gg/DXwENpAed5") +
      " for **support** and **updates**!" */
      .setDescription(
        "Here is the list of commands!\n for more info on specific command , use `dab help {command}`\n"
    )
      .setFooter('Sponserd by ! HITESH BHOOTRA ᴴᴮ#7300')
      .setColor("#7289DA");
     

    // Sort the categories alphabetically
    const keys = Object.keys(map).sort();

    for (const category of keys) {
      // Skip un-needed categories
      if (category === "Social" && msg.guild && !msg.guild.settings.social)
        continue;

      embed
        .addField(category, map[category].join(", "))
        .setFooter('Sponserd by ! HITESH BHOOTRA ᴴᴮ#7300')
        .setAuthor("Command List", msg.author.displayAvatarURL());
    }
    try {
      return msg.send(`${await this.badge(msg)}  Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, {
        embed: embed,
      });
    } catch (err) {
      return msg.send(`${await this.badge(msg)} Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, {
        embed: embed,
      });
    }
  }
}

module.exports = Help;
