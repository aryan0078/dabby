const { MongoClient } = require("mongodb");
const { poolValue } = require("../utils/constants");
const QuickChart = require("quickchart-js");
const { uid } = require("uid");

async function getPools(d) {
  let db = d;
  let pools = db.collection("pools");
  return pools.find().toArray();
}
async function generateCoupons(amount, id, d, p = false) {
  let db = d;
  let coupon = db.collection("coupons");
  let code = uid(16);
  await coupon.insertOne({
    id: code,
    claimed: p ? true : false,
    amount: amount,
    generatedBy: id,
    generatedAt: new Date(),
    activeafter: p ? p : new Date()
  });
  return code;
}
async function claimCode(code, id, d) {
  let db = d;
  let coupon = db.collection("coupons");

  let coupons = await coupon.findOne({ id: code });
  if (coupons && !coupons.claimed) {

    await coupon.deleteOne({ id: code })
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
async function randomUser(d) {
  let db = d;
  let users = db.collection("members");
  let found = await users.aggregate([{ $sample: { size: 1 } }]);
  let u = await found.toArray()
  //console.log(u[0])
  return u[0]
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
          invites: c.invites ? c.invites.length : 0,
        };
      }
    }
  } catch {
    return undefined;
  }
}
async function getAllCrates(msg, d) {
  let db = d;
  let crates = db.collection('crates');
  let allc = await crates.find({ of: msg.author.id }).toArray()
  if (allc) {
    return allc
  } else {
    return []
  }
}
async function checkUserHasTicket(user, id, d) {
    let db = d;
  let crates = db.collection('userTickets');
  let f = await crates.findOne({ id: id, of: user });
  if (f) {
    return f
  } else {
    return false
  }

}
async function addCrate(msg, ticketid, d) {
  let db = d;
  let crates = db.collection('crates');
  let cid = uid(5);
  await crates.insertOne({ id: cid, of: msg.author.id, opened: false, reciveat: new Date(), contains: ticketid });
  return true
}
async function removeOneCrate(msg, d) {
  let db = d;
  let crates = db.collection('crates');
  let allc = await getAllCrates(msg, d);
  await crates.deleteOne({ id: allc[0].id })
}
async function getTicket(id, d) {
  let db = d;
  let tc = db.collection('ticket');
  let t = tc.findOne({ id: id });
  return t
}

async function openCrate(msg, d) {
  let db = d;
  let crates = db.collection('crates');
  let allc = await getAllCrates(msg, d);

  if (allc.length == 0) {
    return false
  } else {

    let t = await giveTicket(msg, allc[0].contains, d);
    if (!t) {
      return false
    }
    await crates.deleteOne({ id: allc[0].id })
    return t
  }


}
async function getAllTickets(msg, ind = false, d) {
  let db = d;
  let ut = db.collection('userTickets');
  let tc
  if (ind) {
    tc = await ut.findOne({ of: msg.author.id, id: parseInt(ind)})
   if(!tc){
     return false
   }
   let evalt=await evalTicket(tc.id,d)
    
    return evalt
  } else {
    tc = await ut.find({ of: msg.author.id }).sort({id:1}).toArray();
  }

  for (let index = 0; index < tc.length; index++) {
    const ticket = tc[index];
    let eval = await evalTicket(ticket.id, d)
    if (eval) {
      tc[index]['link'] = eval.link
      tc[index]['name'] = eval.name
      tc[index]['hp']=eval.hp
    } else {
      tc[index]['link'] = null
    }


  }
  /* tc.map(async (tick) => {
    arr.push(await evalTicket(tick.id, d))
  }) */

  if (tc.length == 0) {

    return false

  }

  return tc
}
async function evalTicket(id, d) {
  let db = d;
  let ut = db.collection('tickets');
  return await ut.findOne({ id: id })
}
async function giveTicket(msg, ticketid, d) {
  let db = d;
  let ut = db.collection('userTickets');
  let tc = await ut.findOne({ id: ticketid, of: msg.author.id });
  if (tc) {
    return false
  } else {
    await ut.insertOne({ id: ticketid, recivedat: new Date(), of: msg.author.id })
    return ticketid
  }


}
async function channelEandD(id, boolean,mimic=false, d) {
  let db = d;
  let pools = db.collection("channels");
  let c = await pools.findOne({ id: id });
  if (c) {
    await pools.findOneAndUpdate({ id: id }, { $set: { enabled: boolean,mimic:mimic } });
  } else {
    await pools.insertOne({ id: id, enabled: boolean,mimic:mimic });
  }
}
async function checkChannelEandD(id, d) {
  let db = d;
  let pools = db.collection("channels");
  let c = await pools.findOne({ id: id });
  if (!c) {
    return true;
  } else {
    return c.enabled;
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
async function topleaderboard(param, page, db) {
  let server = db;
  members = server.collection("members");
  let lists = await members.find().sort({ points: -1 }).limit(page).toArray();
  return lists;
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

const dabbyflowchart = async (title, data, db) => {
  const chart = new QuickChart();
  var db_ = db;
  db_ = db_.collection("currencyFlow");

  let p = await db_.find().sort({ $natural: -1 }).limit(50).toArray();
  let price = [];
  let dates = [];
  for (let index = 0; index < p.length; index++) {
    const element = p[index];
    price.push(element.flow);
    dates.push(element.at.toTimeString().slice(0, 5));
  }
  chart
    .setConfig({
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Dabs",
            data: price,
            fill: false,
            borderColor: "red",
          },
        ],
      },
    })
    .setWidth(1024)
    .setHeight(728);
  return await chart.getUrl();
};
const transactionLog = async (amount, user, user2, server, db) => {
  var db_ = db;
  db_ = db_.collection("transations");
  db_.insertOne({
    amount: amount,
    at: new Date(),
    by: user,
    to: user2,
    server,
  });
};
const chart = async (title, data, db) => {
  const chart = new QuickChart();
  const db_ = db;
  let p = await db_.find().sort({ $natural: -1 }).limit(40).toArray();
  let price = [];
  let dates = [];
  for (let index = 0; index < p.length; index++) {
    const element = p[index];
    price.push(element.priceQuote);
    dates.push(element.at.toTimeString().slice(0, 5));
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
async function paydab(id, recieveid, amt, server, d) {
  let db = d;
  let users = db.collection("members");
  let user1bal = await users.findOne({ id: id });
  let user2bal = await users.findOne({ id: recieveid });
  if (user1bal.points < amt) {
    return {msg:"Insufficient Balance",success: false}
  }
  if (!user2bal) {
    return {msg:"User is not a member of Dabby",success: false}
  }
  await users.findOneAndUpdate(
    { id: id },
    { $set: { points: user1bal.points - amt } }
  );
  await users.findOneAndUpdate(
    { id: recieveid },
    { $set: { points: user2bal.points + amt } }
  );
  transactionLog(amt, id, recieveid, server, d);
  return  {msg:"Done",success: true}
}
async function givedabs(id, amount, d) {
  let db = d;
  let users = db.collection("members");
  let user1bal = await users.findOne({ id: id });


  await users.findOneAndUpdate(
    { id: id },
    { $set: { points: user1bal.points + amount } }
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
  dabbyflowchart,
  withdrawAmount,
  getBalanceExists,
  checkChannelEandD,
  channelEandD,
  withdrawBalance,
  transactionLog,
  topleaderboard,
  randomUser,
  givedabs,
  openCrate,
  addCrate,
  getAllCrates,
  getTicket,
  giveTicket,
  removeOneCrate,
  getAllTickets,
  checkUserHasTicket,
  evalTicket
};
