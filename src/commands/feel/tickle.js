const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Tickle extends Command {
    constructor(...args) {
        super(...args, {
            description: "Tickle someone",
            usage: "tickle <@member>",
            guildOnly: true,
            cooldown: 3,
            cost: 5
        });
    }

    async run(msg, [member]) {
        member = await this.verifyMember(msg, member);
        let user = await this.verifyUser(msg, member)
        if (member.id === msg.author.id) return msg.send("Baka! You can't tickle yourself!");

        const { url } = await fetch("https://nekos.life/api/v2/img/tickle")
            .then((res) => res.json());

        const embed = this.client.embed()
            .setAuthor(`${member.displayName}, you just got tickled`, user.displayAvatarURL())
            .setImage(url)
            .setFooter(`by ${msg.member.displayName}`, msg.author.displayAvatarURL())


        return msg.send(`Requested by **${msg.author.username}**`, { embed: embed });
    }
}

module.exports = Tickle;