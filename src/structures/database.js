const { MongoClient } = require("mongodb");
const { poolValue } = require("../utils/constants");
const QuickChart = require("quickchart-js");
const { uid } = require("uid");

async function getPools(d) {
  let db = d;
  let pools = db.collection("pools");
  return pools.find().toArray();
}
async function generateCoupons(amount, id, d) {
  let db = d;
  let coupon = db.collection("coupons");
  let code = uid(16);
  await coupon.insertOne({
    id: code,
    claimed: false,
    amount: amount,
    generatedBy: id,
    generatedAt: new Date(),
  });
  return code;
}
async function claimCode(code, id, d) {
  let db = d;
  let coupon = db.collection("coupons");

  let coupons = await coupon.findOne({ id: code });
  if (coupons && !coupons.claimed) {
    await coupon.findOneAndUpdate(
      { id: code },
      { $set: { claimed: true, claimedAt: new Date(), claimedBy: id } }
    );
    return coupons;
  } else {
    return false;
  }
}
async function addStake(id, userid, amount, withdraw = false, d) {
  let db = d;
  let pools = db.collection("pools");
  let pool = await pools.findOne({ id: id });
  let getPrevAmt = await checkStaked(id, userid,  d);
  if (withdraw) {
    let f =
      getPrevAmt.amount - amount === 0
        ? await pools.findOneAndUpdate(
            { id: id },
            { $pull: { users: { userid: userid } } }
          )
        : await pools.findOneAndUpdate(
            { id: id, "users.userid": userid },
            { $set: { "users.$.amount": getPrevAmt.amount - amount } }
          );
    return f.ok;
  }

  let f = await pools.findOneAndUpdate(
    { id: id },
    {
      $push: { users: { userid: userid, amount: amount, at: poolValue(pool) } },
    }
  );
  return f.ok;
}
async function getCurrencyBalance(id, server, d) {
  try {
    let db = d;
    let users = db.collection("members");
    let c = await users.findOne({ id: id });
    for (let index = 0; index < c.wallet.length; index++) {
      const bal = c.wallet[index];
      if (bal.id === server) {
        return {
          amount: bal.amount,
          currencyEmoji: bal.currencyEmoji,
          currencyName: bal.currencyName,
          invites: bal.invites ? bal.invites.length : 0,
        };
      }
    }
  } catch {
    return undefined;
  }
}
async function withdrawAmount(id, user, amount, d) {
  let db = d;
  let pools = db.collection("pools");
  let pool = await pools.findOne({ id: id });
  if (pool) {
    let pooltotal = poolValue(pool);
    let usercash = await checkStaked(id, user,d);
    if (usercash.at <= pooltotal) {
      let reducer = 100 - (usercash.at / pooltotal) * 100;
      return (amount * reducer) / 100;
    }
    let reducer = 100 - (usercash.at / pooltotal) * 100;
    return (amount * reducer) / 100;
  }
}

async function withdrawBalance(id, server, amount, withdraw = true, db) {
  let usercash = db;
  let cash = usercash.collection("members");
  /* let c = await cash.findOne({ id: id }); */
  let getPrevAmt = await getCurrencyBalance(id, server,db);
  if (!getPrevAmt) {
    getPrevAmt = 0;
  }
  if (!getPrevAmt && !withdraw) {
    let filter = amount;
    await cash.findOneAndUpdate(
      { id: id },
      { $set: { "wallet.$.amount": filter, "wallet.id": server } }
    );
    return;
  }
  if (withdraw) {
    let filter =
      getPrevAmt.amount - amount <= 0 ? 0 : getPrevAmt.amount - amount;
    await cash.findOneAndUpdate(
      { id: id, "wallet.id": server },
      { $set: { "wallet.$.amount": filter } }
    );
    return true;
  } else {
    let filter =
      getPrevAmt.amount + amount <= 0 ? 0 : getPrevAmt.amount + amount;
    await cash.findOneAndUpdate(
      { id: id, "wallet.id": server },
      { $set: { "wallet.$.amount": filter } }
    );
  }
}
async function getCurrency(id, db) {
  let server = db;
  server = server.collection("guilds");
  let res = await server.findOne({ id: id });

  return res
    ? res
    : {
        currencyEmoji: "<:dabs:851218687255773194> ",
        currencyName: "dabs",
        cryptoEnabled: false,
      };
}
async function checkStaked(id, userid, d) {
  let db = d;
  let pools = db.collection("pools");
  let userstake = await pools.findOne({ id: id });
  if (userstake) {
    for (let index = 0; index < userstake.users.length; index++) {
      const user = userstake.users[index];
      if (userid === user.userid) {
        return user;
      }
    }
  }
  return false;
}
async function getBalanceExists(userid, server, d) {
  let db = d;
  let users = db.collection("members");
  let c = await users.findOne({ id: userid });
  if (!c.wallet) {
    return false;
  }
  for (let index = 0; index < c.wallet.length; index++) {
    const element = c.wallet[index];
    if (element.id == server) {
      return true;
    }
  }
  return false;
}
async function addPool(d) {
  let db = d;
  let pool = db.collection("pools");
  pool.insertOne({
    host: "aryan",
    poolName: "Massive pool",
    maxPrice: 500000,
    maxUsers: 10000000,
    value: 0,
    createdAt: new Date(),
    users: [{}],
  });
}
const chart = async (title, data, db) => {
  const chart = new QuickChart();
  const db_ = db;
  let p = await db_.find().sort({ $natural: -1 }).limit(25).toArray();
  let price = [];
  let dates = [];
  for (let index = 0; index < p.length; index++) {
    const element = p[index];
    price.push(element.priceQuote);
    dates.push(element.at.toTimeString().slice(0, 8));
  }
  chart
    .setConfig({
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Price",
            data: price,
            fill: false,
            borderColor: "blue",
          },
        ],
      },
    })
    .setWidth(800)
    .setHeight(400);
  return await chart.getUrl();
};
async function cloudSync() {
  let db = await MongoClient.connect(
    "mongodb+srv://dabby:dabby@cluster0.ispdz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  return db.db();
}
async function paydab(id, recieveid, amt, d) {
  let db = d;
  let users = db.collection("members");
  let user1bal = await users.findOne({ id: id });
  let user2bal = await users.findOne({ id: recieveid });

  await users.findOneAndUpdate(
    { id: id },
    { $set: { points: user1bal.points - amt } }
  );
  await users.findOneAndUpdate(
    { id: recieveid },
    { $set: { points: user2bal.points + amt } }
  );
}
async function verifyUser(user, d) {
  let db = d;
  let users = db.collection("members");
  let u = await users.findOne({ id: user });
  if (!u) {
    return false;
  } else if (u) {
    return true;
  }
}
async function getdabbal(id, d) {
  let db = d;
  let c = db.collection("members");
  return c.findOne({ id: id });
}
module.exports = {
  claimCode,
  generateCoupons,
  paydab,
  chart,
  getPools,
  verifyUser,
  addPool,
  getdabbal,
  addStake,
  checkStaked,
  cloudSync,
  getCurrencyBalance,
  getCurrency,
  withdrawAmount,
  getBalanceExists,
  withdrawBalance,
};
