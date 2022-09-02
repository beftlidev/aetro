const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 

module.exports = {
  en: {
    name: "profile", 
    options: [{
            name: 'user',
            description: 'Whose profile will you look at?',
            type: 'USER',
            required: false
           }], 
    description: "🤔 You can look at someone\'s profile or your own.",
  },
    run: async (client, interaction) => {

const user = interaction.options.getUser('user') || interaction.user

let u;
 var d = await client.users.fetch(user.id, {force: true}) 
let banner = d.banner
if(banner) {
u = `${d.bannerURL({ dynamic: true, size: 2048 })}`;
} else {
u = "https://media.discordapp.net/attachments/973462223383064586/994627983463686244/Picsart_22-06-19_13-20-01-167.jpg";
}

let mesaj = await client.message.fetch(`toplam_mesaj_${interaction.guild.id}_${user.id}`) 

const embed = new Discord.MessageEmbed()
.setTitle(`${user.tag} ( ${user.id} )`)
.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
.setDescription(`💭 Total messages you sent: ${mesaj || "He never texted me."}`) 
.setColor('BLUE')
.setImage(`${u}`)

let a;
let c;
let activities = interaction.guild.members.cache.get(message.author.id).presence.activities.length
if(activities == 2) {
a = interaction.guild.members.cache.get(message.author.id).presence.activities[1].name;
c = interaction.guild.members.cache.get(message.author.id).presence.activities[1];
} else if(activities == 1) {
a = interaction.guild.members.cache.get(message.author.id).presence.activities[0].name;
c = interaction.guild.members.cache.get(message.author.id).presence.activities[0];
} else if(activities == 0) {
a = "empty";
}

let b;
if(a === "Spotify") {
b = `${await client.emoji.fetch(`spotify`)} Listening to **Spotify**
🎵 Song: ${c.details}
👥 Artist: ${c.state}
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>, End <t:${parseInt(c.timestamps.end / 1000)}:R>`;
} else if(a === "Minecraft") {
b = `${await client.emoji.fetch(`minecraft`)} Playing **Minecraft**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "Lunar Client") {
b = `${await client.emoji.fetch(`lunarclient`)} Playing **Lunar Client**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "Visual Studio Code") {
b = `${await client.emoji.fetch(`vsc`)} Playing **Visual Studio Code**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "ROBLOX") {
b = `${await client.emoji.fetch(`roblox`)} Playing **ROBLOX**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "YouTube") {
b = `${await client.emoji.fetch(`youtube`)} Watching **YouTube**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "CraftRise") {
b = `${await client.emoji.fetch(`craftrise`)} Playing **CraftRise**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "SonOyuncu Minecraft Client") {
b = `${await client.emoji.fetch(`so`)} Playing **SonOyuncu Minecraft Client**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "VALORANT") {
b = `${await client.emoji.fetch(`valorant`)} Playing **VALORANT**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "LabyMod") {
b = `${await client.emoji.fetch(`labymod`)} Playing **LabyMod**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "League of Legends") {
b = `${await client.emoji.fetch(`lol`)} Playing **League of Legends**
⏰ Start: <t:${parseInt(c.timestamps.start / 1000)}:R>`;
} else if(a === "empty") {
b = `❔ Nothing is playing.`;
} else {
b = `❔ Nothing is playing.`;
}

const embed2 = new Discord.MessageEmbed()
.setDescription(`${b}`)

interaction.reply({embeds: [embed, embed2]})

} 
}
