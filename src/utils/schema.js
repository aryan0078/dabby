
// Default values for database settings.
module.exports = {
  // Per-server settings.
  guilds: {
    weebGreetings: false,
    prefix:"dab",
    levelup: true,
    social: true,
    starboard: { channel: null, limit: 2 },
    stockSignup:false,
    stocks: { limit:50,guildValue: 0, stockHolders: [{ id: null, percentage:0,amount:0,time:new Date(),purchasedAtValue: 0}],}, //initial value=Online members
  tradeRecords:[]
  },
  
  // Global bot settings.
  client: {
    blacklist: [], // Blacklisted User IDs
    guildBlacklist: [], // Blacklisted Server IDs
    commands: {}, // How much each command is ran. Example Format: { ping: 5, kick: 2, say: 3 }
  },

  // Per-user settings (global)
  users: {
    reputation: 0,
    repscooldown: 0,
    title: null,
    prefix: null,
    points: 0,
  },

  // Per-member settings (Per-server)
  members: {
    daily: null,
    level: 0,
    points: 0,
  },
  pools: {
    owner: null,
    createdAt: new Date(),
    
    pool:[],
  },

  // Guild role store. (Per-server)
  store: {
    price: 0,
  },
};
