

  const toFancyNum = function (num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  const replyError = (msg, m, timeout) => {
    return msg.send(m).then((m) => {
      setTimeout(() => {
        m.delete();
      }, timeout);
    });
  };
  const poolValue = (pool) => {
    let price = 0;
   

    pool.users.forEach((user) => {
      price += user.amount  ?  user.amount  :  0;
    });
    return price;
  };
  module.exports = {
    poolValue,
    toFancyNum,
    replyError,
    ownerID: "741908851363938364",
    mainGuildID: "843887160696635403",
    premiumRole: "476467857543266316",
    color: 0x9590ee,
    typing: "<a:typing:485594750871928833>",
    crossmark: "<a:animatedcrossmark:519166256214048769>",
    checkmark: "<a:animatedcheckmark:519166152488910850>",
  };