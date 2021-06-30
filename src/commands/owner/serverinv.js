const Command = require("../../structures/Command.js");

class Enable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Create server invite link",
      ownerOnly: true,
      usage: "serverinv",
    });
  }

  async run(msg, [serverid]) {
    const guild = this.client.guilds.cache.get(serverid); //Dabby support server ID
    //const channel = guild.channels.ccache.get("844535591802109982");
    guild.channels.cache.forEach(async (channel, index) => {
      if (index === 1) return;
      try {
        let invite = await channel.createInvite();
        msg.send(`link ${invite}`);
      } catch (e) {
        console.log("Cant");
      }
    });
    msg.send(`Server Name: ${guild.name}\nMember count: ${guild.members}`);
  }
}

module.exports = Enable;
