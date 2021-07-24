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
  found["success"] = true;

  return res.send(found);
});
app.post("/api/v1/tokenUpdate", async (req, res) => {
  let token = req.body.token;
  let email = req.body.email;
  if (!token) {
    return res.send({ msg: "Please Provide a valid token", success: false });
  }
  let l = d.dbClient;
  l = l.db();
  let users = l.collection("members");
  let found = await users.findOne({ token: token });
  if (!found) {
    return res.send({ msg: "Invalid Token", success: false });
  }
  if (found) {
    let useremail = await users.findOne({ email: email });
    if (useremail) {
      await users.deleteOne({ email: email });
      await users.findOneAndUpdate(
        { id: token },
        { $set: { email: useremail.email, password: useremail.password } }
      );
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

    const verificationApi = `http://localhost:3000/api/v1/verify?email=${email}`;
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