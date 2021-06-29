const Command = require("../../structures/Command.js");
const { toFancyNum } = require("../../utils/constants.js");
const {
  getCurrency,
  getCurrencyBalance,
} = require("../../structures/database.js");
class Points extends Command {
  constructor(...args) {
    super(...args, {
      description: "View your or someone's balance.",
      usage: "balance [@user]",
      guildOnly: true,
      cooldown: 10,
      aliases: ["balance", "bal", "b", "cash", "c", "wallet", "w", "wal", "dw"],
    });
  }

  async run(msg, [all]) {
    const member = await this.verifyMember(msg, msg.author.id, true);
    if (member.user.bot) return msg.send(" Bots don't have points.");
    await member.syncSettings();
    let db = this.client.dbClient;
    db = await db.db();

    let user_ = db.collection("members");
    let dabs = await getCurrency(msg.guild.id, db);
    let wallets = await user_.findOne({ id: msg.author.id });
    if (wallets == null) {
      let cash = db.collection("members");
      await cash.insertOne({
        id: msg.author.id,
        points: 1000,
        wallet: [],
        level: 1,
      });
    }
    try {
      wallets = await user_.findOne({ id: msg.author.id });
      let bal = await getCurrencyBalance(msg.author.id, msg.guild.id, db);
      let walstr = `**${msg.author.username}**, you have \n`;

      if (!bal) {
        bal = dabs;
        bal["amount"] = 0;
      }
      walstr +=
        `>>> **${bal.currencyEmoji} | ** you have ` +
        `**${toFancyNum(bal.amount)}** ${bal.currencyName}! from **${
          msg.guild.name
        }** \n`;
      if (!wallets.wallet) {
        wallets["wallet"] = [];
      }
      let ful=''
      if (all=='all') {
         wallets.wallet.forEach((wallet, index) => {
           ful +=
             `**${wallet.currencyEmoji} | ** you have ` +
             `**${toFancyNum(wallet.amount)}** ${wallet.currencyName}! ${
               wallet.serverName ? "from " + wallet.serverName : ""
             } \n`;
         });
        msg.send(`**Check DM**`).then((m) => {
          m.react("👍");
        });
        return member.send(
          `**${
            msg.author.username
          } |** you have ,\n${ful}------------------------------------- \n **${toFancyNum(
            member.settings.points
          )}** <:dabs:851218687255773194> dabs cash`
        );
      }
     
      walstr +=
        wallets.wallet.length > 4
          ? `.... and **${
              wallets.wallet.length - 4
            }** more \n -----------------------------------\n<:dabs:851218687255773194> | Dabs: **${toFancyNum(
              member.settings.points
            )}**  dabs `
          : `-----------------------------------\n<:dabs:851218687255773194> | Dabs: **${toFancyNum(
              member.settings.points
            )}**  dabs `;
      msg.send(walstr);
    
    } catch (e) {
      console.log(e);
      msg.send(
        "I guess you are new to Dab now you are signed Up you can now run command again to see you dabby!"
      );
    }
  }
}

module.exports = Points;
