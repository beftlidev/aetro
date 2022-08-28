const Discord = require('discord.js');

const {MessageActionRow, MessageButton, Modal, TextInputComponent} = require("discord.js") 
const addModal = require("../helpers/addModal")
const db = require("croxydb") 

module.exports = {

  en: {
    name: "button-role", 
  options: [
       {          
           name: 'role',
            description: 'What role do I give to the person who clicks the button? ❔ Example: @User', 
            type: 'ROLE',
            required: true
        }, 
       {          
            name: 'color',
            description: 'Present what color the button wants?',
            type: 'STRING',
            required: true, 
            choices: [{name: "Gray", value: "SECONDARY"}, {name: "Blue", value: "PRIMARY"}, {name: "Red", value: "DANGER"}, {name: "Green", value: "SUCCESS"}]
        }, 
      {          
            name: 'label',
            description: 'Present what he wants on the button? ❔ Example: User',
            type: 'STRING',
            required: true
        }, 
       {          
            name: 'emoji',
            description: 'Choose any emoji you want.',
            type: 'STRING',
            choices: [
{name: 'Empty', value: ''}, 
{name: 'Giveaway Emoji', value: '🎉'}, 
{name: 'Announce Emoji', value: '📢'}, 
{name: 'Star Emoji', value: '⭐'}, 
{name: 'World Emoji', value: '🌐'}, 
{name: 'Bell emoji', value: '🔔'}, 
{name: 'Developer Badge Emoji', value: '973476287496745000'}, 
{name: 'Pen Emoji', value: '973487128346521631'}, 
{name: 'Waving Emoji', value: '973486268317065286'}, 
{name: 'Vote Emoji', value: '973476072953876480'},
], 
            required: true
        }, 
], 
    description: '🔖 You set a button role.'
  },

    run: async (client, interaction) => {
var values = interaction.options._hoistedOptions.map(a => a.value)
var rol = values[0]
var renk = values[1]
var yazı = values[2]
var emoji = values[3]
let kanal = interaction.channel

const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle(renk) 
.setEmoji(`${emoji || ""}`)
.setLabel(yazı) 
.setCustomId("buton_rol") 
);


if(await client.verifieduser.fetch(`onaylı_kullanıcı_${interaction.user.id}`) === `evet`) {

if(!interaction.member.permissions.has('ADMINISTRATOR')){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to administrator to create a button role.',
                ephemeral: true
            });
        }
const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("message")
                    .setLabel("Message")
                    .setPlaceholder("What do you want to write as a message? ❔ Example: Click the button below and get a role!")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
            ),
        ]
        const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Button role")
        const modalSubmitInteraction = await addModal(interaction, modal)
        const message = modalSubmitInteraction.fields.getTextInputValue("message")
const mesaj = await kanal.send({content: message, components: [row]}) 
interaction.reply({content: `Button role set to ( ${kanal}, <@&`+rol+`>, ${renk}, ${yazı}, ${emoji || "Specified!"} )`, ephemeral: true}) 
await client.buttonrole.set(`buton_rol_${mesaj.id}_${interaction.guild.id}`, `${rol}`)
} else {
let mesaj = `😔 You must be an approved user to create a button role. 
👍 You can apply for an approved user from the button below!
⚠️ If the button is not working, click on the \`Support Server\` button and apply from our support server.`
const onay = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('SECONDARY')
.setLabel('Apply')
.setEmoji('')
.setCustomId('onayli'), 
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setEmoji('')
.setURL('https://discord.gg/KZfAEjrPUF') 
) 
interaction.reply({content: mesaj, components: [onay]}) 
}

} 
}
