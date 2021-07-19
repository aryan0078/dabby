const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { token: 'Nzg0NzE3NjgzNDU0Mzc4MDI0.X8tXSw.RjQN0xePeMt2tt9q9nAxBOkrzxw' });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();