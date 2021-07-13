const Command = require("../../structures/Command.js");

class SetBadge extends Command {
    constructor(...args) {
        super(...args, {
            description: "Set badge which is going to come on every command",
            aliases: ["setbadge", "stb", "sb", "sbadge"],

            usage: "setbadge badgeid",
            guildOnly: true
        });
    }

    async run(msg, [id]) {
        return msg.send('Coming soon')
    }
}

module.exports = SetBadge;
