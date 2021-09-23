const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { token: 'ODkwNTYxOTY5MDQyNjQwOTI2.YUxmdw.vpqDgq9qK8tMkdxMFnBHybkS2lY', totalShards: "auto" });

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);

});

manager.spawn(manager.totalShards, 10000);
/* manager.on("message", (shard, message) => {
    console.log(`Shard[${shard.id}]:${message._eval}`)
}) */
//manager.listeners()
