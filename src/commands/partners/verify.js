const Command = require("../../structures/Command.js");
const { addPool, generateCoupons } = require("../../structures/database.js");
const serverValue = require("../../structures/servervalue.js");
const { replyError, toFancyNum } = require("../../utils/constants.js");

class VerifyServer extends Command {
    constructor(...args) {
        super(...args, {
            description: "This command is used by partners to verify user for partnership in the server",
            ownerOnly: false,
            usage: "vs @user",
            aliases: ["verifyserver", "vs"],
        });
    }

    async run(msg, user) {
        let use = await this.verifyMember(msg, user);
        let dmuser = await this.verifyUser(msg, user)
        if (!await this.globalpartnercheck(msg)) {
            return replyError(msg, 'This command is only for global partners', 5000)
        }
        let db = this.client.dbClient;
        db = await db.db();
        let u = await db.collection("partners");
        let serverVal = await serverValue(msg.guild, msg);
        let check = await u.findOne({ server: msg.guild.id, verified: true })
        if (check) {
            return replyError(msg, `<@${check.id}> is already verifed partner of this server\nPlease Ask developers to change or update it`, 8000)
        }
        let p = await u.findOneAndUpdate({ server: msg.guild.id }, { $set: { verified: true, verifiedAt: new Date(), verifiedBy: msg.author.id } });

        let amount = 0.1 * parseInt(((serverVal * 100) / 100) * 1500000);
        let activeafter = new Date()
        activeafter.setDate(activeafter.getDate() + 10)
        let code = await generateCoupons(amount, msg.author.id, db, activeafter);
        try { use.send(`Hi Dabby User you are verified by **${msg.author.username}** for **${msg.guild.name}** you are now partner of this server at ${new Date()} you will get total of **${toFancyNum(amount)}** <:dabs:851218687255773194> dabs coupon code your coupon will be active after ${activeafter} you can claim this by dab claim command Your code is \n**${code}**`) }
        catch (err) {
            console.log(err)
            return msg.send(`Cant send dm to the verified user please tell him to contact support server to get the partnership dabs`)
        }

        return msg.send(`${msg.author.username} you have successfully verified <@${use.id}> for partnership program he will get the redeem code in dm`)


    }
}

module.exports = VerifyServer;
