const { Client, GatewayIntentBits, Collection } = require('discord.js');
const bot = new Client({
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ]
});
const config = require("./config.json")
const fs = require('fs')
const Timeout = new Set();
bot.prefix = config.prefix_command === true ? config.prefix : "/";
bot.commands = new Collection();
bot.aliases = new Collection();
bot.categories = fs.readdirSync("./commands/");

require(`./handlers/commandHandle`)(bot);

bot.on('ready', () => {
    require('./events/ready')(bot)
    bot.user.setPresence({ activities: [{ name: `${bot.prefix}help 來獲取幫助` }], status: 'online' });
})

bot.on('messageCreate', async message => {
    require('./events/messageCreate')(bot, message, Timeout, config)
})

bot.on('interactionCreate', async interaction => {
    require("./events/interactionCreate")(bot, interaction, Timeout, config)
});

bot.login(config.token)
