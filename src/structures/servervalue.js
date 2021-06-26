const { users } = require("../utils/schema");

const serverValue = async (server, msg) => {
  //1 bond = 1500000
  let onlineMembers = [];
  let totalmembers = [];
  let ownerCash = 0;
  let onlineMembers_ = (await server.members.fetch()).filter((member) => {
    if (
      member.user.presence.status == "dnd" ||
      member.user.presence.status == "idle" ||
      member.user.presence.status == "online"
    ) {
      onlineMembers.push(member);
    } else {
      totalmembers.push(member);
    }
  });

  /* await server.members.fetch({ withPresences: true }).then((members) => {
    members.forEach((member) =>
      console.log(member.user.username, member.user.presence.status)
    );
  }); */
  //console.log(onlineMembers);
  /*   let totalmembers = (await server.members.fetch()).size; */
  // console.log(totalmembers, onlineMembers, ownerCash);
  return 0.01 * (onlineMembers.length + totalmembers.length);
};
module.exports = serverValue;
