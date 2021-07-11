const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Pat extends Command {
    constructor(...args) {
        super(...args, {
            description: "Pat someone",
            usage: "pat <@member>",
            guildOnly: true,
            cooldown: 3,
            cost: 5
        });
    }

    async run(msg, [member]) {
        member = await this.verifyMember(msg, member);
        let user = await this.verifyUser(msg, member)
        if (member.id === msg.author.id) return msg.send("Baka! You can't pat yourself!");

        const { url } = await fetch("https://nekos.life/api/v2/img/pat")
            .then((res) => res.json());

        const embed = this.client.embed()
            .setAuthor(`${member.displayName}, you just got pats`, user.displayAvatarURL())
            .setImage(url)
            .setFooter(`from ${msg.member.displayName}`, msg.author.displayAvatarURL())

        return msg.send({ embed });
    }
}

module.exports = Pat;