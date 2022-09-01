const Discord = require('discord.js');
const { Op } = require("sequelize")
const { bold } = require("@discordjs/builders")
const { userMention, time: timestamp } = require("@discordjs/builders")
const { v4: uuidv4 } = require("uuid")
const db2 = require("../helpers/database-giveaway.js") 
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
module.exports = {
  en: {
    name: "giveaway-settings", 
    options: [{
            name: 'id',
            description: 'Write the message id of which giveaway you want to trade.',
            type: 'STRING',
            required: true
           }], 
    description: "Settings Giveaway",
  },
    run: async (client, interaction) => {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: `${await client.emoji.fetch(`no`)} You must have permissions to \`Manage Events\` or \`Giveaways\` role to manage the giveaway.`,
                ephemeral: true
            });
        }
const id = interaction.options.getString('id')
const giveaway2 = await client.giveaway.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if(db.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: `${await client.emoji.fetch(`no`)} This giveaway is already over!`}) 
} else {

const embed = new Discord.MessageEmbed()
.setDescription(`Choose the action you want to do from the buttons below!`)
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('gw_end')
                .setLabel("End")
                .setStyle("SECONDARY")
                .setEmoji(""),
            new MessageButton()
                .setCustomId('gw_delete')
                .setLabel("Delete")
                .setStyle("SECONDARY")
                .setEmoji("")
        )

  const message = await interaction.reply({embeds: [embed], components: [row]})

await client.giveaway.set(`gw_settings_user_${message.id}`, `${interaction.user.id}`)
await client.giveaway.set(`gw_settings_id_${message.id}`, `${id}`)

    setTimeout(async () => {
await client.giveaway.delete(`gw_settings_user_${message.id}`)
await client.giveaway.delete(`gw_settings_id_${message.id}`)
message.edit({content: `${await client.emoji.fetch(`no`)} This command has expired.`, embeds: [], components: []})
}, 300000)


}

}
}
