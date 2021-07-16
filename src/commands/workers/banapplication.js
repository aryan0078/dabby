const Command = require("../../structures/Command.js");
const { replyError } = require("../../utils/constants.js");


class BanApplication extends Command {
    constructor(...args) {
        super(...args, {
            description: "This command is only for workers",
            usage: "banapp <@user>",
            aliases: ["ba", "banapplic"],
            cooldown: 60
        });
    }

    async run(msg, [user, ...args]) {
        user = await this.verifyUser(msg, user)
        if (!await this.workercheck(msg)) {
            return replyError(msg, 'This command is only for workers', 5000)
        }
        if (!args) return msg.send("Plase mention reasoon also");
        const channel = this.client.channels.cache.get("865529531976122368");

        const embed = this.client
            .embed()
            .setTitle("Reason")
            .setDescription(args.join(' '))
            .setThumbnail(user.displayAvatarURL({ size: 512 }))
            .setAuthor(user.tag, user.displayAvatarURL({ size: 512 }))
            .setFooter(`For User ID: ${user.id}`);

        const message = await channel.send("Ban Application", { embed: embed });

        return msg.send(
            `Your ban report has been successfully submitted${msg.guild && msg.guild.id !== "843887160696635403"
                ? " to the support server"
                : ""
            }.`
        );
    }
}

module.exports = BanApplication;
