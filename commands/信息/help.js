const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { stripIndents } = require("common-tags");
const ms = require('ms')
module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "幫助列表",
    usage: "[command | alias]",
    options: [
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            description: '指令名字',
            required: false
        }],
    run: async (bot, message, args, config) => {
        if (args[0]) {
            return getCMD(bot, message, args[0]);
        } else {
            return getAll(bot, message);
        }
    }
}

function getAll(bot, message) {
    const embed = new EmbedBuilder()
        .setColor("Random")

    const commands = (category) => {
        return bot.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join(" ");
    }

    const info = bot.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.reply({ embeds: [embed.setDescription(info)] });
}

function getCMD(bot, message, input) {
    const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

    let info = `沒有找到指令 **${input.toLowerCase()}**`;
    const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(info)

    if (!cmd) {
        return message.channel.send({ embeds: [embed] });
    }

    if (cmd.name) info = `**指令名字**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**执行**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**描述**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**用法**: ${cmd.usage}`;
        embed.setFooter({ text: `语法: <> = 必须, [] = 可选` });
    }
    if (cmd.timeout) info += '\n**冷卻**: ' + ms(cmd.timeout)

    embed.setColor("Random").setDescription(info)

    return message.reply({ embeds: [embed] });
}