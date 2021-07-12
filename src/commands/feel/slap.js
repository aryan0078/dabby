const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Slap extends Command {
    constructor(...args) {
        super(...args, {
            description: "Slap someone",
            usage: "slap <@member>",
            guildOnly: true,
            cooldown: 3,
            cost: 5
        });
    }

    async run(msg, [member]) {
        member = await this.verifyMember(msg, member);
        let user = await this.verifyUser(msg, member)
        if (member.id === msg.author.id) return msg.send("Baka! You can't slap yourself!");

        const { url } = await fetch("https://nekos.life/api/v2/img/slap")
            .then((res) => res.json());

        const embed = this.client.embed()
            .setAuthor(`${member.displayName}, you just got slaps`, user.displayAvatarURL())
            .setImage(url)
            .setFooter(`from ${msg.member.displayName}`, msg.author.displayAvatarURL())


        return msg.send(`Requested by **${msg.author.username}**`, { embed: embed });
    }
}

module.exports = Slap;