const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 

module.exports = {
  en: {
    name: "level", 
    options: [], 
    description: "🔮 It helps you to use level commands.",
  },
    run: async (client, interaction) => {

if(!await client.level.fetch(`durum_${interaction.guild.id}`) {

if(!interaction.member.permissions.has('ADMINISTRATOR')){
            return interaction.reply({
                content: `${await client.emoji.fetch(`no`)} Please talk to an admin whose level system is deactivated!`,
                ephemeral: true
            });
        }

const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`no`)} Level system is not active! To activate, choose from the buttons below.`)
const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('level_yes')
                .setLabel("Activate")
                .setStyle("PRIMARY")
                .setEmoji(""), 
            new MessageButton()
                .setCustomId('level_no')
                .setLabel("Cancel")
                .setStyle("DANGER")
                .setEmoji(""),
)

const message = await interaction.reply({embeds: [embed], components: [row]})
await client.level.set(`level_user_${message.id}`, `${interaction.user.id}`)
    setTimeout(async () => {
await client.level.delete(`level_user_${message.id}`)
message.delete()
}, 300000)

} else {

const embed = new Discord.MessageEmbed()
.setTitle(`🔮 Level commands`)
.setDescription(`Select the command you want to use below.`) 
const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('rank')
                .setLabel("Rank")
                .setStyle("PRIMARY")
                .setEmoji(""), 
            new MessageButton()
                .setCustomId('leaderboard')
                .setLabel("Leaderboard")
                .setStyle("PRIMARY")
                .setEmoji(""),
)
const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('level_channel')
                .setLabel("Set level channel")
                .setStyle("DANGER")
                .setEmoji(""),
            new MessageButton()
                .setCustomId('level_close')
                .setLabel("Close level")
                .setStyle("DANGER")
                .setEmoji(""),
)

if(interaction.member.permissions.has('ADMINISTRATOR')) {

const message = await interaction.reply({embeds: [embed], components: [row, row2]})
await client.level.set(`level_user_${message.id}`, `${interaction.user.id}`)
    setTimeout(async () => {
await client.level.delete(`level_user_${message.id}`)
message.delete()
}, 300000)

} else {

const message = await interaction.reply({embeds: [embed], components: [row]})
await client.level.set(`level_user_${message.id}`, `${interaction.user.id}`)
    setTimeout(async () => {
await client.level.delete(`level_user_${message.id}`)
message.delete()
}, 300000)

}

}

} 
}
