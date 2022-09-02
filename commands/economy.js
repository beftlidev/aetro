const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 

module.exports = {
  en: {
    name: "economy", 
    options: [], 
    description: "💵 You get access to economy housing.",
  },
    run: async (client, interaction) => {

const embed = new Discord.MessageEmbed()
.setTitle(`${await client.emoji.fetch(`slash`)} Economy commands`)
.setDescription(`Select the command you want to use below.`) 

const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('info')
                .setLabel("Info")
                .setStyle("SUCCESS")
                .setEmoji(""),
            new MessageButton()
                .setCustomId('slots')
                .setLabel("Slots")
                .setStyle("SUCCESS")
                .setEmoji(""),
            new MessageButton()
                .setCustomId('cookie')
                .setLabel("Cookie")
                .setStyle("SUCCESS")
                .setEmoji(""),
            new MessageButton()
                .setCustomId('give_coin')
                .setLabel("Give")
                .setStyle("SUCCESS")
                .setEmoji(""),
)
const row2 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('daily')
                .setLabel("Daily")
                .setStyle("PRIMARY")
                .setEmoji(""), 
            new MessageButton()
                .setCustomId('vote_coin')
                .setLabel("Vote coin")
                .setStyle("PRIMARY")
                .setEmoji(""),
)

const message = await interaction.reply({embeds: [embed], components: [row, row2]})

await client.economy.set(`economy_user_${message.id}`, `${interaction.user.id}`)

    setTimeout(async () => {
await client.economy.delete(`economy_user_${message.id}`)
message.edit({content: `${await client.emoji.fetch(`no`)} This command has expired.`, embeds: [], components: []})
}, 300000)

} 
}
