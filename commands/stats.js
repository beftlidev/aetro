const Discord = require('discord.js');
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
const moment = require('moment')
const os = require('os')

module.exports = {
  en: {
    name: "stats", 
    options: [], 
    description: "ℹ️ Shows the bot\'s statistics.",
  },
    run: async (client, interaction) => {

   const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Web Site')
.setEmoji('🌐')
.setURL('https://aetro.xyz/')
) 

const Teyit = await client.komut.all().filter(data => data.ID.startsWith(`komut_`)).sort((a, b) => b.data - a.data)
        Teyit.length = 1
        let FinalDB = ""
        for (var i in Teyit) {
          FinalDB += `\`/${Teyit[i].ID.slice(6)}\` (\`${Teyit[i].data}\` Usage)`
        }

		const guildd = client.guilds.cache.size
const userr = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()
const embed = new Discord.MessageEmbed()
    .setColor("RANDOM") 
    .setAuthor("Space Giveaway Info") 
.setDescription(`**• General Statistics**
${await client.emoji.fetch(`server`)} Total servers: **${guildd}**
${await client.emoji.fetch(`user`)} Total Users: **${userr}**
**• Server Information**
🏓 Ping: **${client.ws.ping}**
**• Versions**
${await client.emoji.fetch(`djs`)} Discord.js Version: **${Discord.version}**
${await client.emoji.fetch(`node`)} Node.js Version: **16.13.2**
${await client.emoji.fetch(`kitap`)} Bot Version: **1.8.3**
**• Bot Statistics**
💾 Memory Usage: **${(process.memoryUsage().heapUsed / 2024 / 2024).toFixed(2)} / 8 GB**
**• Command Statistics**
💻 Total Commands: **${client.commands.size}**
💻 Most used command: **${FinalDB.replace('undefined','Unknown command.')}**
${await client.emoji.fetch(`slash`)} Total Command Usage: **${db.fetch(`bot_using`)}**`)  
.setTimestamp() 
interaction.reply({ embeds: [embed], components: [row]}) 

} 
}
