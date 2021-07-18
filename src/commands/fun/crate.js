const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command.js");
const { getAllCrates, addCrate } = require("../../structures/database.js");
const { toFancyNum, replyError } = require("../../utils/constants.js");

class GenerateCoupons extends Command {
    constructor(...args) {
        super(...args, {
            description: "Open your crates",
            usage: "crate",
            guildOnly: true,
            cooldown: 10,
            aliases: ["crate", "lb", "lootbox"],
        });
    }

    async run(msg, args) {

        let db = this.client.dbClient;

        db = await db.db();

        let crates = await getAllCrates(msg, db);
        if (crates.length == 0) {

            return replyError(msg, "you dont have any crates", 5000);
        }

        if (args == "open") {
            msg.send('Coming soon....')
            /*  let embed = new MessageEmbed().setImage('https://media.giphy.com/media/5YrT02HhIpbiqFbF4j/giphy.gif')
             let ticketembed = new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/774359995298349066/866424367042527272/59_7.png')
 
             msg.send(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**You Opend a crate**`, { embed: embed }).then(m => {
                 setTimeout(async () => {
                     m.edit(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\n**And recived**`, { embed: ticketembed })
                 }, 5000)
             }) */
        } else {
            return msg.send(`${await this.badge(msg)} **${msg.author.username} ${await this.beta(msg) ? this.betaemoji : ''}**,\nYou have **${crates.length}** ${this.crate} crate\nuse \`dab crate open\` to open crates`)
        }






    }
}

module.exports = GenerateCoupons;
