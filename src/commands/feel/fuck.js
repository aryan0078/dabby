const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Fuck extends Command {
    constructor(...args) {
        super(...args, {
            description: "Fuck someone",
            usage: "fuck <@member>",
            guildOnly: true,
            cooldown: 3,
            cost: 5
        });
    }

    async run(msg, [member]) {
        member = await this.verifyMember(msg, member);
        let user = await this.verifyUser(msg, member)
        if (member.id === msg.author.id) return msg.send(" You can't fuck your ass by yourself!");

        const { url } = await fetch("https://nekos.life/api/v2/img/anal")
            .then((res) => res.json());

        const embed = this.client.embed()
            .setAuthor(`${member.displayName}, you just got your anal`, user.displayAvatarURL())
            .setImage(url)
            .setFooter(`by ${msg.member.displayName}`, msg.author.displayAvatarURL())

        return msg.send(`${await this.badge(msg)}  Requested by **${msg.author.username}** ${await this.beta(msg) ? this.betaemoji : ''}`, { embed: embed });
    }
}

module.exports = Fuck;