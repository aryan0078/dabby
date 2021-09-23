const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { token: 'ODkwNTYxOTY5MDQyNjQwOTI2.YUxmdw.hMf3aElfffrzph7o9EfVzbQRqaU', totalShards: "auto" });

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);

});

manager.spawn(manager.totalShards, 10000);
/* manager.on("message", (shard, message) => {
    console.log(`Shard[${shard.id}]:${message._eval}`)
}) */
//manager.listeners()
