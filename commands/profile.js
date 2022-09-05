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

let mesaj = await client.message.fetch(`toplam_mesaj_${interaction.guild.id}_${user.id}`) 

let a;
let c;
let activities;
try {
activities = interaction.guild.members.cache.get(message.author.id).presence.activities.length;
} catch(e) {
activities = "bos";
}
if(a == "Custom Status") {
} else if(activities == 2) {
a = interaction.guild.members.cache.get(user.id).presence.activities[1].name;
c = interaction.guild.members.cache.get(user.id).presence.activities[1];
} else if(activities == 1) {
a = interaction.guild.members.cache.get(user.id).presence.activities[0].name;
c = interaction.guild.members.cache.get(user.id).presence.activities[0];
} else if(activities == "bos") {
a = "empty";
}

let yetki;
if(interaction.member.permissions.has('ADMINISTRATOR')) {
yetki = "Admin";
} else {
yetki = "Member";
}

let elapsed;
if(a === "Custom Status") {
} else if(activities == 2) {

let started = c.timestamps.start
let today = Date.now() 
elapsed = moment.utc(today).format("x") - moment.utc(started).format("x")

} else if(activities == 1) {

let started = c.timestamps.start
let today = Date.now() 
elapsed = moment.utc(today).format("x") - moment.utc(started).format("x")

} else if(activities == "bos") {
}

let b;
let logo;
if(a === "Spotify") {
b = `Listening to Spotify
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "Minecraft") {
b = `Playing Minecraft
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "Lunar Client") {
b = `Playing Lunar Client
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "Visual Studio Code") {
b = `Playing Visual Studio Code
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "ROBLOX") {
b = `Playing ROBLOX
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "YouTube") {
b = `Watching YouTube
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "CraftRise") {
b = `Playing CraftRise
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "SonOyuncu Minecraft Client") {
b = `Playing SonOyuncu Minecraft Client
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "VALORANT") {
b = `Playing VALORANT
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "LabyMod") {
b = `Playing LabyMod
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "League of Legends") {
b = `Playing League of Legends
${moment(elapsed).format("HH:mm:ss")} elapsed`;
logo = "";
} else if(a === "empty") {
b = `Nothing is playing.`;
logo = "";
} else if(a === "Custom Status") {
} else {
b = `Nothing is playing.`;
logo = "";
}

    const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;
	do {
		context.font = `25px montserrat-bold`;
	} while (context.measureText(text).width > canvas.width - 300);
	return context.font;
};

let mev = `https://media.discordapp.net/attachments/1008041770459869275/1016368253645377647/Canavas_for_cheesey.png`
let userinfo = {};
userinfo.dctarih = moment.utc(interaction.guild.members.cache.get(user.id).user.createdAt).format('DD/MM/YYYY')
userinfo.dctarihkatilma = moment.utc(interaction.guild.members.cache.get(user.id).joinedAt).format('DD/MM/YYYY')
const canvas = Canvas.createCanvas(1000, 500);
const context = canvas.getContext('2d');
const background = await Canvas.loadImage(mev);
context.drawImage(background, 0, 0, canvas.width, canvas.height);
context.strokeStyle = '#0099ff';
context.strokeRect(0, 0, canvas.width, canvas.height);
context.font = applyText(canvas, `Your participation confirmed!`);
context.fillStyle = '#ffffff';
context.fillText(`${user.tag}`, 135, 325);
context.fillText(`${b}`, 175, 385);
context.fillText(`${yetki}`, 585, 125);
context.fillText(`${mesaj}`, 585, 225);
context.fillText(`${userinfo.dctarihkatilma}`, 585, 325);
context.fillText(`${userinfo.dctarih}`, 585, 425);
const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
context.drawImage(avatar, 195, 95, 160, 160);
    const av = await Canvas.loadImage(logo);
context.drawImage(av, 135, 355, 35, 35);
const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

const embed = new Discord.MessageEmbed()
.setColor('BLUE')
.setImage(`attachment://profile.png`)

interaction.reply({embeds: [embed], files: [attachment]})

} 
}
