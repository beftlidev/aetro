const {
    bold,
    time: timestamp,
    channelMention,
    roleMention,
} = require("@discordjs/builders")
const Discord = require('discord.js');
const end = require("../helpers/end-poll.js")
const { v4: uuidv4 } = require("uuid")
const addModal = require("../helpers/addModal")
const {
    MessageActionRow,
    MessageEmbed,
    MessageButton,
    TextInputComponent,
    Modal,
} = require("discord.js")
const db = require("../helpers/database-poll.js")
const ms = require('ms') 
const db2 = require('croxydb');
const { duration } = require("moment");
module.exports = {
  en: {
    name: "poll", 
    description: '✏️ You start a indefinite or timed poll',
    options: [
       {          
            name: 'type',
            description: 'What genre do you want to start the poll as?',
            type: 'STRING',
            required: true, 
            choices: [{name: "Indefinite", value: "süresiz"}, {name: "Timed", value: "süreli"}]
        }, 
       {          
            name: 'channel',
            description: 'Is there a channel you want? ❔ Example: #poll',
            type: 'CHANNEL',
            required: false 
        }
    ]
  },
    run: async (client, interaction) => {

if(tip === "süresiz") { 

const k = interaction.options.getChannel('channel') 
const kanal = k || interaction.channel

     if(!interaction.member.permissions.has('MANAGE_MESSAGES')){
            return interaction.reply({
                content: `${await client.emoji.fetch(`no`)} You must have permissions to manage messages to start poll.`,
                ephemeral: true
            });
       }

        const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("poll")
                    .setLabel("Poll")
                    .setPlaceholder("Enter a poll text. ❔ Example: Cats are nice, aren\'t they?")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
            ),
        ]
        const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Poll Start")
        const modalSubmitInteraction = await addModal(interaction, modal)
        const desc = modalSubmitInteraction.fields.getTextInputValue("poll")

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${desc}
${await client.emoji.fetch(`message`)} 👍 0 👎 0`) 
.setColor("BLURPLE") 
.setTimestamp() 

const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("👍") 
.setCustomId("oylamaevet"), 
new MessageButton() 
.setStyle("SECONDARY") 
.setLabel("") 
.setEmoji("👎") 
.setCustomId("oylamahayır") 
);

await modalSubmitInteraction.reply({content: `🎉 Ok! The poll was launched on ${kanal} channel!`, ephemeral: true})

const message = await kanal.send({
embeds: [embed], 
components: [row]
})

await client.poll.set(`oylama_${interaction.guild.id}_${message.id}`, `${desc}`)


} else if(tip === "süreli") {

const k = interaction.options.getChannel('channel') 
const kanal = k || interaction.channel
const uuid = uuidv4()

     if(!interaction.member.permissions.has('MANAGE_MESSAGES')){
            return interaction.reply({
                content: `${await client.emoji.fetch(`no`)} You must have permissions to manage messages to start poll.`,
                ephemeral: true
            });
       }

        const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("poll")
                    .setLabel("Poll")
                    .setPlaceholder("Enter a poll text. ❔ Example: Cats are nice, aren\'t they?")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
            ),
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("duration")
                    .setLabel("Duration")
                    .setPlaceholder("How many days/hours/minutes do you want Giveaway to take? ❔ Example: 7h")
                    .setStyle("SHORT")
            ),
        ]
        const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Poll Start")
        const modalSubmitInteraction = await addModal(interaction, modal)
        const desc = modalSubmitInteraction.fields.getTextInputValue("poll")
        const duration = modalSubmitInteraction.fields.getTextInputValue("duration") || "1m"
       
const ends = Date.now() + ms(duration)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${desc}
⏰ Ends: ${timestamp(Math.floor(ends / 1000), "R")} (${timestamp(Math.floor(ends / 1000))})
${await client.emoji.fetch(`message`)} 👍 0 👎 0`) 
.setColor("BLURPLE") 
.setTimestamp() 

const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("👍") 
.setCustomId("oylamaevet_timed"), 
new MessageButton() 
.setStyle("SECONDARY") 
.setLabel("") 
.setEmoji("👎") 
.setCustomId("oylamahayır_timed"),
                        new MessageButton()
            .setLabel("")
            .setStyle("LINK")
            .setEmoji("⏰")
            .setURL(`http://aetro.xyz/?end=${ends}`), 
);
 await modalSubmitInteraction.reply({
            content: `🎉 Ok! The poll was launched on ${kanal} channel!`,
            ephemeral: true,
        })

const message = await kanal.send({
embeds: [embed], 
components: [row]
})

await client.poll.set(`oylama_${interaction.guild.id}_${message.id}`, `${desc}`)
await client.poll.set(`poll_${message.id}`, uuid) 
        const poll = await db.Polls.create({
            uuid: uuid,
            guildId: interaction.guildId,
            userId: interaction.user.id, 
            item: desc,
            channelId: kanal.id,
            endDate: ends
        }) 

        poll.update({ messageId: message.id })
        await end(poll, interaction.client)

}

}
}
