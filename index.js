/**
 * Entry file.
 * Try to keep this file minimum and abstract most of the functionality in seperate files.
 *
 * @author Raven
 * @license MIT
 */

// Load .env
require("dotenv").config();

// Setup Module Alias.
const moduleAlias = require("module-alias");
const { paydab, getdabbal } = require("./src/structures/database.js");
const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
moduleAlias.addAliases({
  "@utils": __dirname + "/src/utils",
  "@structures": __dirname + "/src/structures",
  "@json": __dirname + "/assets/json",
  "@languages": __dirname + "/src/languages",
});

// Load discord.js extensions.
require("./src/extensions/GuildMember.js");
require("./src/extensions/TextChannel.js");
require("./src/extensions/DMChannel.js");
require("./src/extensions/Message.js");
require("./src/extensions/Guild.js");
require("./src/extensions/User.js");

// Import the Client.
const MiyakoClient = require("./src/structures/MiyakoClient.js");
const { toFancyNum } = require("./src/utils/constants.js");

// Login. (And start in development mode if --dev is passed)
let d = new MiyakoClient(process.argv.includes("--dev"));
d.login();

const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const bodyParser = require("body-parser");
const { uid } = require("uid");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => res.send("Hello World!"));
app.post("/api/v1/login", async (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  if (!email || !pass) {
    return res.send({ msg: "Please fill all inputs!", success: false });
  }
  let l = d.dbClient;
  l = l.db();
  let users = l.collection("members");
  let found = await users.findOne({ email: email });
  if (!found) {
    return res.send({ msg: "You are not registered!", success: false });
  } else {
    if (found.password != pass) {
      return res.send({ msg: "Wrong password!", success: false });
    } else if (found.password == pass) {
      if (!found.verified) {
        return res.send({
          msg: "Please verify your email address",
          success: false,
        });
      }
      return res.send({ msg: "Login Successful!", success: true });
    }
  }
  return res.send({ msg: "Something went worng!", success: false });
});
app.post("/api/v1/fetchData", async (req, res) => {
  let email = req.body.email;

  let l = d.dbClient;
  l = l.db();
  let users = l.collection("members");
  let found = await users.findOne({ email: email });
  if(!found){
   return res.send({msg:"Something Went Wrong!",success:false})
  }
  found["success"] = true;

  return res.send(found);
});
app.post("/api/v1/setfcm", async (req, res) => {
  let token = req.body.fcmtoken;
  let id = req.body.id;
  let email = req.body.email;
  let l = d.dbClient;
  l = l.db();
  let users = l.collection("members");
  user = await users.findOneAndUpdate(
    { id: id },
    { $set: { fcmtoken: token } }
  );
  return res.send({ msg: "Token set", success: true });
});
app.post("/api/v1/paymentNotification", async (req, res) => {
  let from = req.body.from;
  let to = req.body.to;
  let amount = req.body.amount;
  var FCM = require("fcm-node");
  var serverKey =
    "AAAAG_OrKsY:APA91bHIU_HSFdgED9F3AnV4j5jWaAd5hEYK9vb3jwkJFDjFYExnS8SuukqCpDtH8XRpebz3ZewR6fD2BTZvBCt85Cg-oqhTNOdNx4p0C9zCzaXuwMN-XvFQMQLavt091YFiVCuwh8ZK"; //put your server key here
  var fcm = new FCM(serverKey);
  if (!to) {
    return res.send({ msg: "Recipient not found", success: false });
  }
  let l = d.dbClient;
  l = l.db();
  let users = l.collection("members");
  let found = await users.findOne({ id: to });

  if (!found || !found.fcmtoken) {
    return res.send({ msg: "Fcm token not found", success: false });
  }
  console.log(found, found.fcmtoken);
  let fcmto = found.fcmtoken;
  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: fcmto,
    collapse_key: "your_collapse_key",

    notification: {
      title: `${amount} Recived!`,
      body: `From ${from}`,
    },
  };

  await fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
  return res.send({ msg: "Success", success: true });
});
app.post("/api/v1/tokenUpdate", async (req, res) => {
  let token = req.body.token;
  let email = req.body.email;
  console.log(token);
  if (!token) {
    return res.send({ msg: "Please Provide a valid token", success: false });
  }
  let l = d.dbClient;
  l = l.db();
  let users = l.collection("members");
  let found = await users.findOne({ apploginToken: token });

  if (!found) {
    return res.send({ msg: "Invalid Token", success: false });
  }
  if (found) {
    let useremail = await users.findOne({ email: email });
    if (useremail) {
      let payload = {
        ...found,
        email: useremail.email,
        password: useremail.password,
        verified: true,
       
      };
      payload['_id']=found._id
     /*  await users
      await users.findOneAndUpdate({ email: email }, { $set: payload }); */
     await users.findOneAndUpdate({ apploginToken: token }, { $set: payload });
      return res.send({ msg: "Account Linked successfully!", success: true });
    }
    return res.send({ msg: "Unable to find account", success: false });
  }
});
app.get("/api/v1/verify", async (req, res) => {
  let l = d.dbClient;
  l = l.db();

  let email = req.query.email;
  let users = l.collection("members");

  let verify = await users.findOne({ email: email });
  if (!verify) {
    return res.send({ msg: "Wrong data", success: false });
  } else {
    await users.findOneAndUpdate(
      { email: email },
      { $set: { verified: true } }
    );
    return res.send({
      msg: "Verification Successful now you can login!",
      success: true,
    });
  }
});
app.post("/api/v1/recentTransactions", async (req, res) => {
  let email = req.body.email;
  let id = req.body.id;
  if (!email || email == "" || email.length < 7 || !id) {
    return res.send({
      msg: "Done!",
      success: true,
      transactions: [],
    });
  }
  let l = d.dbClient;
  l = l.db();
  let logs = await l.collection("transations");
  let payload = [];

  let array = await logs
    .find({ by: `${id}` })
    .sort({ at: -1 })
    .limit(10)
    .toArray();

  if (!array) {
    return res.send({
      msg: "Done!",
      success: true,
      transactions: [],
    });
  } else {
    for (let index = 0; index < array.length; index++) {
      const l = array[index];
      let p = await d.users.fetch(l.to);
      l["avatar"] = await p.displayAvatarURL({
        format: "png",
        dynamic: true,
      });
      l["username"] = p.username;
    }
    return res.send({
      msg: "Done!",
      success: true,
      transactions: array,
    });
  }
});
app.post("/api/v1/pay", async (req, res) => {
  let email = req.body.email;
  let id = req.body.id;
  let reciveid = req.body.recipient;
  let amount = req.body.amount;
  let l = d.dbClient;
  l = l.db();

  if (!id || !reciveid || !amount || !parseInt(amount)) {
    return res.send({ msg: "Failed", success: false });
  }
  let s = await paydab(id, reciveid, parseInt(amount), "app", l);
  if (s.success) {
    return res.send({ msg: "Sucess", success: true, tid: uid(10) });
  } else {
    return res.send({ msg: s.msg, success: false });
  }
});
app.post("/api/v1/fetchUser", async (req, res) => {
  let email = req.body.email;
  let id = req.body.id;
  if (!email || email == "" || email.length < 7 || !id) {
    return res.send({
      msg: "Done!",
      success: true,
      transactions: [],
    });
  }
  let l = d.dbClient;
  l = l.db();
  let members = await l.collection("members");
  let payload = [];

  let array = await members.findOne({ id: id });
  payload.push(array);
  if (!array) {
    return res.send({
      msg: "Done!",
      success: true,
      transactions: [],
    });
  } else {
    for (let index = 0; index < payload.length; index++) {
      const l = payload[index];
      let p = await d.users.fetch(l.id);
      l["avatar"] = await p.displayAvatarURL({
        format: "png",
        dynamic: true,
      });
      l["username"] = p.username;
    }
    return res.send({
      msg: "Done!",
      success: true,
      transactions: payload,
    });
  }
});
app.post("/api/v1/signup", async (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  let l = d.dbClient;
  l = l.db();
  if (!email || !pass || email == "" || pass == "" || email.length < 7) {
    return res.send({
      msg: "Please enter all details properly!",
      success: false,
    });
  }

  let users = l.collection("members");
  let found = await users.findOne({ email: email });
  if (found) {
    return res.send({ msg: "Email is already registered!", success: false });
  }
  if (!found) {
    await users.insertOne({
      email: email,
      password: pass,
      verified: false,
      points: 5,
      level: 0,
    });

    const verificationApi = `https://dabby.aryansingh24.repl.co/api/v1/verify?email=${email}`;
    await sendmail(
      email,
      `Please click on following link to verify your email address:${verificationApi}`
    );
    return res.send({
      msg: "Signup successful please check you mails",
      success: true,
    });
  }
  return res.send({ msg: "Something went worng!", success: false });
});

async function sendmail(email, message) {
  var nodemailer = require("nodemailer");
  const youremail = "dabbydego@gmail.com";
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: youremail,
      pass: "Aryan@2020",
    },
  });

  var mailOptions = {
    from: youremail,
    to: email,
    subject: "Dabby App Verification",
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}