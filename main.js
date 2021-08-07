const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { token: 'Nzg0NzE3NjgzNDU0Mzc4MDI0.X8tXSw.plimjGKyzj_6FyeRh4BVtESyF5k', totalShards: "auto" });

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);

});

manager.spawn(manager.totalShards, 10000);
/* manager.on("message", (shard, message) => {
    console.log(`Shard[${shard.id}]:${message._eval}`)
}) */
//manager.listeners()