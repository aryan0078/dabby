const { Permissions } = require("discord.js");
const Base = require("./Base.js");
const path = require("path");

class Command extends Base {
  constructor(client, store, file, options = {}) {
    super(client, store, file, options);

    this.description = options.description || "No Description Provided.";
    this.extendedHelp = options.extendedHelp || "No extended help provided.";
    this.ownerOnly = options.ownerOnly || false;
    this.aliases = options.aliases || [];
    this.cooldown = options.cooldown || 0;
    this.cost = options.cost || 0;
    this.nsfw = options.nsfw || false;
    // File path is like general/ping.js we split by / and take general title-cased if not provided.
    this.category = options.category || this.client.utils.toProperCase(file.path.split(path.sep)[0]) || "General";
    this.guildOnly = options.guildOnly || false;
    this.hidden = options.hidden || false;
    this.usage = options.usage || this.name;
    this.loading = options.loading;
    this.betaemoji = "<:beta:864583906321367040>"
    this.badges = {
      "1": { emoji: '<:bughunter:864570206894686238>', name: 'Bug Hunter', id: 1 }, "2": { id: 2, emoji: '<:supporter:864572703918129172>', name: 'Supporter' }, "3": { id: 3, emoji: '<:partner:864571816932933672>', name: 'Partner' }, "4": { name: 'Beta User', emoji: '<a:arrowmain:859510039740022814>' }, "5": { name: 'Top Global', emoji: '<:TopGlobal:864596160547127297>' }, "6": {
        emoji: '<:reputation:864607883949375498>', name: "Reputed one's"
      }, "7": { emoji: '<:worker:865247421458415646>', name: 'Worker' }, "8": { emoji: '<:guide:865249524369063956>', name: 'Guider' }
    }
    this.botPermissions = new Permissions(options.botPermissions || []).freeze();
    this.userPermissions = new Permissions(options.userPermissions || []).freeze();

    // Helper alias.
    this.responses = this.client.responses;
  }

  async _run(msg, args) {
    try {
      if (this.loading && msg.guild) {
        await msg.send(this.loading
          .replace(/{{displayName}}/g, msg.member.displayName)
          .replace(/{{username}}/g, msg.author.username)
          .replace(/{{tag}}/g, msg.author.tag)
          .replace(/{{mention}}/g, msg.member.toString())
          .replace(/{{guild}}/g, msg.guild.name)
          .replace(/{{typing}}/g, this.client.constants.typing))
          .catch(() => null);
      }

      // Run the check function first.
      const check = await this.check(msg, args);

      // If the value is falsy, silently fail.
      if (!check) return;

      // If the value is a string reply it to the user.
      if (typeof check === "string") return msg.send(check);

      // Run the command.
      const results = await this.run(msg, args);
 
      // If the results is a string reply it to the user.
      if (typeof results === "string") return msg.send(results);
    } catch(err) {
      // Forward errors to commandError event.
      this.client.emit("commandError", msg, err);
    }
  }

  /**
   * Verifies that a user is given.
   */
  async verifyUser(msg, user, defaultToAuthor = false) {
    if (!user && defaultToAuthor) return msg.author;
    if (!user) throw "What do you expect me to do without a user mention or an ID?";
    const match = /^(?:<@!?)?(\d{17,19})>?$/.exec(user);
    if (!match)
      throw " That's not a user mention or an ID. What were you trying to do?";
    user = await this.client.users.fetch(match[1]).catch(() => null);
    // We will assume they gave IDs as mentions are highly unlikely to fail.
    if (!user) throw "I couldn't find that user! Make sure the ID is correct.";
    return user;
  }
  async globalpartnercheck(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let user = await u.findOne({ id: msg.author.id })
    if (user.gp) {
      return true
    } else {
      return false
    }
  }
  async workercheck(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let user = await u.findOne({ id: msg.author.id })
    if (user.worker) {
      return true
    } else {
      return false
    }
  }
  async guidercheck(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let user = await u.findOne({ id: msg.author.id })
    if (user.guider) {
      return true
    } else {
      return false
    }
  }


  /**
   * Verifies that a member is given.
   */
  async verifyMember(msg, member, defaultToAuthor = false) {
    const user = await this.verifyUser(msg, member, defaultToAuthor);
    const guildMember = await msg.guild.members.fetch(user).catch(() => null);
    if (!guildMember) throw " That user is not in this server.";
    return guildMember;
  }
  async beta(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let badgeExist = await u.findOne({ id: msg.author.id })
    if (badgeExist && badgeExist.beta) {
      return true
    } else {
      return false
    }

  }
  async badge(msg) {
    let db = this.client.dbClient;
    db = await db.db();
    let u = await db.collection("members");
    let badgeExist = await u.findOne({ id: msg.author.id });
    if (!badgeExist.badge && !badgeExist.badges) {
      return ''
    }
    if (badgeExist.badge) {
      return this.badges[badgeExist.badge].emoji
    } else {
      return this.badges[badgeExist.badges[0].badgeid].emoji
    }


  }
  async verifyChannel(msg, channel, defaultToCurrent = false) {
    if (!channel && defaultToCurrent) return msg.channel;
    if (!channel) throw "You need to mention a channel or provide an ID.";

    const match = /^(?:<#)?(\d{17,19})>?$/.exec(channel);
    if (!match) throw "Invalid channel, must be a mention or an ID.";

    const chan = await this.client.channels.fetch(match[1]).catch(() => null);
    if (!chan) throw msg.language.get("CHANNEL_NOT_FOUND");

    return chan;
  }

  verifyRole(msg, rolename, optional = false) {
    if (!rolename && optional) return null;
    if (!rolename) throw " You must provide a role name or ID.";
    rolename = rolename.toLowerCase();

    // We check by ID or name. Nobody mentions roles for an argument.
    const role = msg.guild.roles.cache.find(role => (role.id === rolename) ||
      (role.name.toLowerCase() === rolename));

    if (!role) throw msg.language.get("ROLE_NOT_FOUND");

    return role;
  }

  verifyInt(num, def) {
    if (typeof def === "number" && !num) return def;
    const parsed = parseInt(num && num.replace(/,/g, ""));
    if (isNaN(parsed)) throw " You must provide a valid number.";
    return parsed;
  }

  /**
   * Executed before the command is ran.
   * A boolean is to be returned to either allow command execution or not.
   * A string can be returned to block execution with an error message.
   * @abstract
   * @returns {Boolean|String}
   */
  async check() {
    return true;
  }

  /**
   * The actual command implementation, must be implemented in a subclass.
   * @abstract
   */
  async run(msg) {
    return msg.send(`${this.constructor.name} does not provide a \`run()\` implementation.${msg.author.id !== this.client.constants.ownerID ? " This is a bug, please report this in our server at https://discord.gg/mDkMbEh" : ""}`);
  }
}

module.exports = Command;
