const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const INTENTS = Object.entries(Discord.Intents.FLAGS).filter(([K]) => !["GUILD_PRESENCES"].includes(K)).reduce((t, [, V]) => t | V, 0)
const client = new Discord.Client({intents: INTENTS}) 
const Util = require('util') 
const {Collection} = require("discord.js"),
      {readdirSync} = require("fs")
const db = require("croxydb"); 
const { MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const got = require("got");
const express = require('express')
const app = express()
const Canvas = require('canvas') 
const fetch = ("node-fetch");
const fs = require("fs");
const xp = require('simply-xp')

xp.connect("mongodb+srv://ugur:ub30082324ub@cluster0.6bouhif.mongodb.net/?retryWrites=true&w=majority", {
  notify: true
})

const {
    JsonDatabase,
    YamlDatabase
} = require("wio.db");

const komut = new JsonDatabase({
    databasePath:"./databases/komut.json" 
});
const verifieduser = new JsonDatabase({
    databasePath:"./databases/User/verified.json" 
});
const coin = new JsonDatabase({
    databasePath:"./databases/Economy/coin.json" 
});
const economy = new JsonDatabase({
    databasePath:"./databases/Economy/settings.json" 
});
const buttonrole = new JsonDatabase({
    databasePath:"./databases/Moderation/buttonrole.json" 
});
const channels = new JsonDatabase({
    databasePath:"./databases/Moderation/channels.json" 
});
const moderation = new JsonDatabase({
    databasePath:"./databases/Moderation/moderation.json" 
});
const giveaway = new JsonDatabase({
    databasePath:"./databases/Giveaway/giveaway.json" 
});
const poll = new JsonDatabase({
    databasePath:"./databases/Poll/poll.json" 
});
const ticket = new JsonDatabase({
    databasePath:"./databases/Moderation/ticket.json" 
});
const message = new JsonDatabase({
    databasePath:"./databases/User/message.json" 
});
const emoji = new JsonDatabase({
    databasePath:"./databases/Emojis/emojis.json" 
});
const level = new JsonDatabase({
    databasePath:"./databases/Level/level.json" 
});

client.komut = komut
client.verifieduser = verifieduser
client.coin = coin
client.economy = economy
client.buttonrole = buttonrole
client.channel = channels
client.moderation = moderation
client.giveaway = giveaway
client.poll = poll
client.ticket = ticket
client.message = message
client.emoji = emoji
client.level = level

client.login("");

client.on('messageCreate', async(message) => {
if(message.author.bot) return;
if(await client.economy.fetch(`aktif_${message.guild.id}`)) {
await client.coin.add(`coin_${message.guild.id}_${message.author.id}`,1)
    await client.message.add(`toplam_mesaj_${message.guild.id}_${message.author.id}`,1)
} else {
await client.message.add(`toplam_mesaj_${message.guild.id}_${message.author.id}`,1)
}
   })

client.on('messageCreate', async (message) => {
  if (!message.guild) return
  if (message.author.bot) return
if(await client.level.fetch(`durum_${message.guild.id}`)) {

  const random = Math.floor(Math.random() * 14) + 1 // Min 1, Max 30
  xp.addXP(message, message.author.id, message.guild.id, random)

}else {
return;
}
})

client.on('levelUp', async (message, data) => {
if(await client.level.fetch(`kanal_${message.guild.id}`)) {
let kanal = client.channels.cache.get(await client.level.fetch(`kanal_${message.guild.id}`))
const embed = new Discord.MessageEmbed()
.setDescription(`🎉 Congratulations, you\'ve leveled up! ( **${Number(data.level-1)} -> ${data.level}** )`)
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle("LINK") 
.setEmoji(``)
.setLabel("Member") 
.setURL(`https://discord.com/users/${message.author.id}`) 
);
kanal.send({content: `${message.author}`, embeds: [embed], components: [row]})
}else {
const embed = new Discord.MessageEmbed()
.setDescription(`🎉 Congratulations, you\'ve leveled up! ( **${Number(data.level-1)} -> ${data.level}** )`)
const msg = await kanal.send({content: `${message.author}`, embeds: [embed]})
setTimeout(async () => {
msg.delete()
}, 10000)
}
})

require("./utils/slash-loader.js")(client)

client.on('interactionCreate', async(interaction) => {
const { Op } = require("sequelize")
const { bold } = require("@discordjs/builders")
const { userMention, time: timestamp } = require("@discordjs/builders")
const { v4: uuidv4 } = require("uuid")
const db2 = require("./helpers/database-giveaway.js") 

if(interaction.customId == "reroll") {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: `${await client.emoji.fetch(`no`)} You must have permissions to \`Manage Events\` or \`Giveaways\` role to manage the giveaway.`,
                ephemeral: true
            });
        }
const id = interaction.message.id
const giveaway2 = await client.giveaway.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if(!await client.giveaway.fetch(`gw_ended_${id}`)) {
interaction.reply({content: `${await client.emoji.fetch(`no`)} This giveaway is not over yet, please try to reroll the winner after the draw ends.`}) 
} else if(await client.giveaway.fetch(`gw_deleted_${id}`) === "deleted") {
interaction.reply({content: `${await client.emoji.fetch(`no`)} This giveaway has been deleted, so you can\'t take any action!`}) 
} else {

        const entrants = await db2.Entrants.findAll({
            where: {
                giveawayUuid: giveaway2,
            },
        })
        const channel = await client.channels.fetch(
            giveaway.channelId
        )
        const message = await client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
 
const winnerNames = []
const entrantList = [...entrants]
            for (
                let i = 0;
                i <
                (giveaway.winners > entrants.length
                    ? entrants.length
                    : giveaway.winners);
                i++
            ) {
                const winnerIndex = Math.floor(Math.random() * entrants.length)
                winnerNames[i] = userMention(entrantList[winnerIndex].userId)
                entrantList.splice(winnerIndex, 1)
            }

const embed = new Discord.MessageEmbed() 
.setTitle('🎉 The giveaway has been rerolled! ') 
.setDescription(`🏆 New winner(s): ${winnerNames.join(", ")}`) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 

interaction.reply({embeds: [embed], components: [row]}) 

}

}

if(interaction.customId == 'cekilis') {
   
    const giveaway2 = await client.giveaway.fetch(`giveaway_${interaction.message.id}`)
    const giveaway = await db2.Giveaways.findOne({
    where: { uuid: giveaway2 },
    })
    if (!giveaway2)
    return interaction.reply({
    content: `${await client.emoji.fetch(`error`)} There was an error. Please try again later.`,
    ephemeral: true,
    })
    
            if(giveaway.requirements !== 'null') {
              if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(giveaway.requirements)) {
              return await interaction.reply({
                content: `${await client.emoji.fetch(`no`)} You do not have the required roles to enter this giveaway.`,
                ephemeral: true,
              })
            }
    
    const result = await db2.Entrants.findOrCreate({
    where: {
    [Op.and]: [
    { giveawayUuid: giveaway.uuid },
    { userId: interaction.user.id },
    ],
    },
    defaults: {
    uuid: uuidv4(),
    userId: interaction.user.id,
    giveawayUuid: giveaway2,
                        },
                    })
    const entrants = await db2.Entrants.findAll({
                    where: {
                        giveawayUuid: giveaway.uuid,
                    },
                })
    
                if (result[1]) {

db.add(`giveaway_entrants_${interaction.message.id}`, 1)
let mrb = db.fetch(`giveaway_entrants_${interaction.message.id}`)

let rol;
if(giveaway.requirements !== "null") {
rol = `<@&${giveaway.requirements}>` 
} else {
rol = "No"
}

const desc = db.fetch(`giveaway_desc_${interaction.message.id}`)
const mew = client.users.cache.get(giveaway.userId)
        const embed = new MessageEmbed()
            .setColor('#2F3136') 
            .setTitle(`${await client.emoji.fetch(`gift`)} ${giveaway.item}`)
            .setDescription(`${await client.emoji.fetch(`yes`)} Click on the button below to enter the giveaway!
📘 ${desc}`)
            .addField(`**• Giveaway Information**`, `${await client.emoji.fetch(`owner`)} Giveaway Owner: ${mew} (\`${mew.tag}\`) \n${await client.emoji.fetch(`message`)} Entrants: **${mrb} (Chance: \`%${Number(100/mrb).toFixed(1)}\`)** \n🏆 Winners: **${giveaway.winners}** \n⏰ Ends: ${timestamp(Math.floor(giveaway.endDate / 1000), "R")} (${timestamp(Math.floor(giveaway.endDate / 1000))})`)
            .addField("**• Requirements**", `${await client.emoji.fetch(`role`)} Role Requirement: ${rol}`,
            )
            .setTimestamp()

await interaction.update({embeds: [embed]})
                  await interaction.reply({
                  content: `${await client.emoji.fetch(`yes`)} You entered the giveaway successfully!`,
                  ephemeral: true,
                  })
                  } else {



                  await interaction.reply({
                  content: `${await client.emoji.fetch(`no`)} You already entered this giveaway.`,
                  ephemeral: true,
                  })
                  }
              } else {
                const result = await db2.Entrants.findOrCreate({
                    where: {
                    [Op.and]: [
                    { giveawayUuid: giveaway.uuid },
                    { userId: interaction.user.id },
                    ],
                    },
                    defaults: {
                    uuid: uuidv4(),
                    userId: interaction.user.id,
                    giveawayUuid: giveaway2,
                                        },
                                    })
                    const entrants = await db2.Entrants.findAll({
                                    where: {
                                        giveawayUuid: giveaway.uuid,
                                    },
                                })
    if (result[1]) {

await client.giveaway.add(`giveaway_entrants_${interaction.message.id}`, 1)
let mrb = await client.giveaway.fetch(`giveaway_entrants_${interaction.message.id}`)

let rol;
if(giveaway.requirements !== "null") {
rol = `<@&${giveaway.requirements}>` 
} else {
rol = "No"
}

const desc = await client.giveaway.fetch(`giveaway_desc_${interaction.message.id}`)
const mew = client.users.cache.get(giveaway.userId)
        const embed = new MessageEmbed()
            .setColor('#2F3136') 
            .setTitle(`${await client.emoji.fetch(`gift`)} ${giveaway.item}`)
            .setDescription(`${await client.emoji.fetch(`yes`)} Click on the button below to enter the giveaway!
📘 ${desc}`)
            .addField(`**• Giveaway Information**`, `${await client.emoji.fetch(`owner`)} Giveaway Owner: ${mew} (\`${mew.tag}\`) \n${await client.emoji.fetch(`message`)} Entrants: **${mrb} (Chance: \`%${Number(100/mrb).toFixed(1)}\`)** \n🏆 Winners: **${giveaway.winners}** \n⏰ Ends: ${timestamp(Math.floor(giveaway.endDate / 1000), "R")} (${timestamp(Math.floor(giveaway.endDate / 1000))})`)
            .addField("**• Requirements**", `${await client.emoji.fetch(`role`)} Role Requirement: ${rol}`,
            )
            .setTimestamp()

await interaction.update({embeds: [embed]})

    await interaction.reply({
    content: `${await client.emoji.fetch(`no`)} You entered the giveaway successfully!`,
    ephemeral: true,
    })
    } else {




    await interaction.reply({
    content: `${await client.emoji.fetch(`no`)} You already entered this giveaway.`,
    ephemeral: true,
    })
    }
              
    }
    
    }
  /*  if(interaction.customId === "cekilis_dbl") {
    
    const Topgg = require("@top-gg/sdk")
    const dbl = new Topgg.Api(db.fetch(`cekilis_topgg_token_${interaction.guild.id}_${interaction.message.id}`)) 
    dbl.hasVoted(interaction.user.id).then(async voted => {
    const giveaway2 = db.fetch(`giveaway_${interaction.message.id}`)
    const giveaway = await db2.Giveaways.findOne({
    where: { uuid: giveaway2 },
    })
    if (!giveaway2)
    return interaction.reply({
    content: "There was an error. Please try again later.",
    ephemeral: true,
    })
    if(voted === false) {
    interaction.reply({content: `<:sgs_cross:921392930185445376> To enter this giveaway, you must vote on the specified bot via top.gg!`, ephemeral: true}) 
    } else {
    const result = await db2.Entrants.findOrCreate({
    where: {
    [Op.and]: [
    { giveawayUuid: giveaway.uuid },
    { userId: interaction.user.id },
    ],
    },
    defaults: {
    uuid: uuidv4(),
    userId: interaction.user.id,
    giveawayUuid: giveaway2,
                        },
                    })
    const entrants = await db2.Entrants.findAll({
                    where: {
                        giveawayUuid: giveaway.uuid,
                    },
                })
    
                if (result[1]) {
                  const sj = new Discord.MessageEmbed() 
    .setDescription(`👥 Total Participating Members: ( **${entrants.length}** )
🏆 Your Chance to Win: ( **%${Number(100/entrants.length).toFixed(1)}** )
                  `) 
                  .setColor('#2F3136') 
                  await interaction.reply({
                  content: `<:sgs_tick:921392926683197460> You entered the giveaway successfully!!`,
                  embeds: [sj],
                  ephemeral: true,
                  })
                  } else {
                      const sj2 = new Discord.MessageEmbed() 
    .setDescription(`👥 Total Participating Members: ( **${entrants.length}** )
🏆 Your Chance to Win: ( **%${Number(100/entrants.length).toFixed(1)}** )
                  `) 
                  .setColor('#2F3136') 
                  await interaction.reply({
                  content: "<:sgs_error:921392927568195645> You already entered this giveaway.",
                  embeds: [sj2],
                  ephemeral: true,
                  })
                  }
    } 
    }) 
    
    
    } */

if(interaction.customId == 'gw_end') {

if(await client.giveaway.fetch(`gw_settings_user_${interaction.message.id}`) === interaction.user.id) {

const id = await client.giveaway.fetch(`gw_settings_id_${interaction.message.id}`)
const giveaway2 = await client.giveaway.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})
if(await client.giveaway.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: `${await client.emoji.fetch(`no`)} This giveaway is already over!`}) 
} else {
    await interaction.message.delete()
        await client.giveaway.set(`gw_ended_${id}`,`ended`)
const guildPrefs = await db2.GuildPrefs.findOne({
                where: {
                    guildId: giveaway.guildId,
                },
            })
            const channel = await client.channels.fetch(
                giveaway.channelId
            )
            const message = await client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
     
        const entrants = await db2.Entrants.findAll({
                where: {
                    giveawayUuid: giveaway.uuid,
                },
            })
            if (entrants.length == 0) {
                const embed = new MessageEmbed()
                    .setTitle("Giveaway Ended! No one attended...")
                        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("") 
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉")
        )
                await message.edit({
                    embeds: [embed],
                    components: [row],
                })
                await giveaway.update({ isFinished: true })
            }
            const winnerNames = []
            const entrantList = [...entrants]
            for (
                let i = 0;
                i <
                (giveaway.winners > entrants.length
                    ? entrants.length
                    : giveaway.winners);
                i++
            ) {
                const winnerIndex = Math.floor(Math.random() * entrants.length)
                winnerNames[i] = userMention(entrantList[winnerIndex].userId)
                entrantList.splice(winnerIndex, 1)
            }
            const embed = new MessageEmbed()
.setColor('#2F3136') 
                .setTitle("Giveaway Ended!")
                .addField(`${await client.emoji.fetch(`gift`)} Prize`, `${bold(giveaway.item)}`)
        const row2 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('reroll')
                .setLabel("Reroll")
                .setStyle("SECONDARY")
                .setEmoji("")
        )
            await message.edit({
                content: null,
                embeds: [embed],
                components: [row2],
            })
const embed2 = new Discord.MessageEmbed() 
.setTitle(`🎉 Giveaway Ended! | Prize: ${giveaway.item}`) 
.setDescription(`🏆 Winner(s): ${winnerNames.join(", ")} \n${giveaway.winners > entrants.length? `The last ${giveaway.winners - entrants.length == 1? "winner slot was": `${giveaway.winners - entrants.length} winner slots were`} not chosen as there were not enough entrants.`: ""}`) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton()
.setStyle('SECONDARY')
.setLabel(`${entrants.length} Entrants!`)
.setEmoji('🎉')
.setCustomId('kdkskdkd'),
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 
interaction.reply({embeds: [embed2], components: [row]}) 

            await giveaway.update({ isFinished: true })
            console.log(`Giveaway ${giveaway.uuid} ended with ${entrants.length} entrants.`)
}

} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}

}

if(interaction.customId == 'gw_delete') {

if(await client.giveaway.fetch(`gw_settings_user_${interaction.message.id}`) === interaction.user.id) {

const id = await client.giveaway.fetch(`gw_settings_id_${interaction.message.id}`)
const giveaway2 = await client.giveaway.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})
if(await client.giveaway.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: `${await client.emoji.fetch(`no`)} This giveaway is already over!`}) 
} else {
   await interaction.message.delete()
const guildPrefs = await db2.GuildPrefs.findOne({
                where: {
                    guildId: giveaway.guildId,
                },
            })
            const channel = await client.channels.fetch(
                giveaway.channelId
            )
            const message = await client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
            const entrants = await db2.Entrants.findAll({
                where: {
                    giveawayUuid: giveaway.uuid,
                },
            })
await client.giveaway.set(`gw_ended_${id}`,`ended`)
await client.giveaway.set(`gw_deleted_${id}`, `deleted`) 
const embed = new Discord.MessageEmbed() 
.setDescription('Giveaway deleted!') 
.setColor('#2F3136') 
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉")
        )
message.edit({content: null, embeds: [embed], components: [row]})
const embed1 = new Discord.MessageEmbed() 
.setTitle('🎉 Giveaway Deleted!') 
.setColor('#2F3136') 
const row1 = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 
interaction.reply({embeds: [embed1], components: [row1]}) 

await giveaway.update({ isFinished: true })
}  


} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}

}


})



client.on("interactionCreate", async (interaction) => {

if(interaction.customId == "welcome_goodbye") {
		await interaction.deferUpdate();
if(await client.moderation.fetch(`moderation_user_${interaction.message.id}`) === interaction.user.id) {

const embed= new Discord.MessageEmbed()
.setDescription(`Select the action you want to do below.
${await client.emoji.fetch(`yes`)} You make this channel (welcome - goodbye), ${await client.emoji.fetch(`no`)} You cancel the transaction, ${await client.emoji.fetch(`error`)} You turn off the system`)

if(!await client.channel.fetch(`welcome_goodbye_${interaction.guild.id}`)) {

const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('wg_yes')
                .setLabel("")
                .setStyle("PRIMARY")
                .setEmoji(`${await client.emoji.fetch(`yesid`)}`), 
            new MessageButton()
                .setCustomId('wg_no')
                .setLabel("")
                .setStyle("PRIMARY")
                .setEmoji(`${await client.emoji.fetch(`noid`)}`),
            new MessageButton()
                .setCustomId('wg_off')
                .setLabel("")
                .setStyle("PRIMARY")
                .setDisabled(true)
                .setEmoji(`${await client.emoji.fetch(`errorid`)}`),
)

interaction.channel.send({embeds: [embed], components: [row]})

} else {

const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('wg_yes')
                .setLabel("")
                .setStyle("PRIMARY")
                .setEmoji(`${await client.emoji.fetch(`yesid`)}`), 
            new MessageButton()
                .setCustomId('wg_no')
                .setLabel("")
                .setStyle("PRIMARY")
                .setEmoji(`${await client.emoji.fetch(`noid`)}`),
            new MessageButton()
                .setCustomId('wg_off')
                .setLabel("")
                .setStyle("PRIMARY")
                .setEmoji(`${await client.emoji.fetch(`errorid`)}`),
)

interaction.channel.send({embeds: [embed], components: [row]})


}


} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}

}


if(interaction.customId == "wg_yes") {
if(await client.moderation.fetch(`moderation_user_${interaction.message.id}`) === interaction.user.id) {

await client.channel.set(`welcome_goodbye_${interaction.guild.id}`, `${interaction.channelId}`)

const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`yes`)} Channel set to (welcome - goodbye)!`)

interaction.channel.send({embeds: [embed]})
} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}
}

if(interaction.customId == "wg_no") {
if(await client.moderation.fetch(`moderation_user_${interaction.message.id}`) === interaction.user.id) {


const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`yes`)} Transaction cancelled!`)

interaction.channel.send({embeds: [embed]})
} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}
}

if(interaction.customId == "wg_off") {
 if(await client.moderation.fetch(`moderation_user_${interaction.message.id}`) === interaction.user.id) {

await client.channel.delete(`welcome_goodbye_${interaction.guild.id}`, `${interaction.channelId}`)

const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`yes`)} (welcome - goodbye) has been deactivated!`)

interaction.channel.send({embeds: [embed]})
} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}
}

})



client.on('guildMemberAdd', async(interaction) => {

if(await client.channels.fetch(`welcome_goodbye_${interaction.guild.id}`)) {

      const canvas = Canvas.createCanvas(1772, 633);
      const ctx = canvas.getContext('2d');
      const background = await Canvas.loadImage(`https://media.discordapp.net/attachments/1012992205700481025/1015262785342550058/welcome_1.png`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f2f2f2';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      var textString3 = `${interaction.user.username}`;
      if (textString3.length >= 14) {
        ctx.font = 'bold 100px Genta';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 20);
      }
      else {
        ctx.font = 'bold 100px Genta';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 5);
      }
      var textString2 = `#${interaction.user.discriminator}`;
      ctx.font = 'bold 40px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString2, 730, canvas.height / 2 + 58);
      var textString4 = `${interaction.guild.memberCount}th Member`;
      ctx.font = 'bold 60px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 750, canvas.height / 2 + 125);
      var textString4 = `${interaction.guild.name}`;
      ctx.font = 'bold 60px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 700, canvas.height / 2 - 150);
      ctx.beginPath();
      ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
      ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
      const welcomeembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTimestamp() 
        .setDescription(`${await client.emoji.fetch(`newmember`)} ${interaction.user}, welcome to the ${interaction.guild.name} server!`)
        .setImage("attachment://welcome-image.png")
      const channel = client.channel.cache.get(await client.channels.fetch(`welcome_goodbye_${interaction.guild.id}`))
      channel.send({embeds: [welcomeembed, files: [attachment]]});

} else {
return;
}

})


client.on('guildMemberRemove', async(interaction) => {

if(await client.channels.fetch(`welcome_goodbye_${interaction.guild.id}`)) {

      const canvas = Canvas.createCanvas(1772, 633);
      const ctx = canvas.getContext('2d');
      const background = await Canvas.loadImage(`https://media.discordapp.net/attachments/1012992205700481025/1015262785342550058/welcome_1.png`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f2f2f2';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      var textString3 = `${interaction.user.username}`;
      if (textString3.length >= 14) {
        ctx.font = 'bold 100px Genta';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 20);
      }
      else {
        ctx.font = 'bold 100px Genta';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 5);
      }
      var textString2 = `#${interaction.user.discriminator}`;
      ctx.font = 'bold 40px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString2, 730, canvas.height / 2 + 58);
      var textString4 = `${interaction.guild.memberCount} Member`;
      ctx.font = 'bold 60px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 750, canvas.height / 2 + 125);
      var textString4 = `${interaction.guild.name}`;
      ctx.font = 'bold 60px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 700, canvas.height / 2 - 150);
      ctx.beginPath();
      ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
      ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
      const welcomeembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTimestamp() 
        .setDescription(`${await client.emoji.fetch(`no`)} **${interaction.user.username}#${interaction.user.discriminator}** left the server, see you`)
        .setImage("attachment://welcome-image.png")
      const channel = client.channel.cache.get(await client.channels.fetch(`welcome_goodbye_${interaction.guild.id}`))
      channel.send({embeds: [welcomeembed, files: [attachment]]});

} else {
return;
}

})

client.on("interactionCreate", async (interaction) => {

if(interaction.customId == "level_yes") {
if(await client.level.fetch(`level_user_${interaction.message.id}`) === interaction.user.id) {
await client.level.set(`durum_${interaction.guild.id}`, "aktif")
const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`yes`)} Level system activated!`)
interaction.update({embeds: [embed], components: []})
} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}
}

if(interaction.customId == "level_no") {
interaction.message.delete()
}

if(interaction.customId == "rank") {

if(await client.level.fetch(`level_user_${interaction.message.id}`) === interaction.user.id) {

   let member = interaction.user.id
xp.rank(interaction, member, interaction.guild.id, {
 background: "https://i.ibb.co/QQvMqf7/gradient.jpg",
  color: '#808080' 
}).then((img) => {
  const embed = new Discord.MessageEmbed()
  .setImage("attachment://rank.png")
  interacton.channel.send({ embeds: [embed], files: [img], components: [] })
})

} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}
}
}

if(interaction.customId == "leaderboard") {

if(await client.level.fetch(`level_user_${interaction.message.id}`) === interaction.user.id) {

await xp.leaderboard(client, message.guild.id).then(board => {
   let lead = []

     board.forEach(user => {
       lead.push(`• ${user.tag} - XP: ${user.shortxp}`)
     })

if(lead.length <= 1) {
    lead = 'No One is in the leaderboard'
}

const embed = new Discord.MessageEmbed()
.setDescription(` ${lead.toString().replaceAll(',', '\n')} `)

     interaction.channel.send({ embeds: [embed], components: []})

} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}

}
}

if(interaction.customId == "level_channel") {
const addModal = require("../helpers/addModal")
const {
    TextInputComponent,
    Modal,
} = require("discord.js") 
if(await client.level.fetch(`level_user_${interaction.message.id}`) === interaction.user.id) {

        const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("channel")
                    .setLabel("Channel")
                    .setPlaceholder("Which channel would you like to level up log? ❔ Example: level-log")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
            ),
]

const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Set level channel")

        const modalSubmitInteraction = await addModal(interaction, modal)
        const channel = modalSubmitInteraction.fields.getTextInputValue("channel")

let a = message.guild.channels.cache.find(kanal => kanal.name === channel)

if(a) {
await client.level.set(`kanal_${message.guild.id}`, `${a.channelId}`)
const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`yes`)} Level log is set!`)
interaction.channel.send({embeds: [embed], components: []})
} else {
const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`no`)} The channel you specified was not found, please try again! Make sure you don\'t prefix it with a #.`)
interaction.channel.send({embeds: [embed], components: []})
} 

} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}

}

}

if(interaction.customId == "level_close") {

if(await client.level.fetch(`level_user_${interaction.message.id}`) === interaction.user.id) {
await client.level.delete(`durum_${interaction.guild.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`${await client.emoji.fetch(`yes`)} Level system deactivated!`)
interaction.channel.send({embeds: [embed], components: []})

} else {
interaction.reply({content: `${await client.emoji.fetch(`no`)} You do not own this message!`, ephemeral: true})
}

}

}

})

client.on("messageCreate", message => {
  if (message.channel.type === "dm") return;
});

client.setMaxListeners(50);

const talkedRecently = new Set();

client.on("interactionCreate", async (button) => {

    if (button.customId == "ticket_ac") {

    let Category = await client.ticket.fetch(`ticket_kategori_${button.guild.id}`);
    let Role = await client.ticket.fetch(`ticket_rol_${button.guild.id}`);
    const ticketChannel = await button.guild.channels.create(
      `${button.user.username}`,
      {
        name: "ticket",
        parent: Category,
        type: "text"
      }
    );
    ticketChannel.permissionOverwrites.create(button.user.id, {
VIEW_CHANNEL: true,
SEND_MESSAGES: true
    });
   ticketChannel.permissionOverwrites.create(Role, {
      VIEW_CHANNEL: true, 
     SEND_MESSAGES: true
    });
    ticketChannel.permissionOverwrites.create(button.guild.id, {  VIEW_CHANNEL: false })
button.reply({content: `${await client.emoji.fetch(`yes`)} Ticket created successfully! ( <#${ticketChannel.id}> )`, ephemeral: true}) 
    const ticketEmbed = new MessageEmbed()
      .setDescription(
        `You can click on the button below to take any action about Ticket.`
      );
const row = new MessageActionRow()
			.addComponents(
    new MessageButton()
      .setStyle("SECONDARY")
.setEmoji('❌') 
      .setLabel("Close")
      .setCustomId("ticket_kapat")
);
    ticketChannel.send({content: `${button.user} - <@&`+ Role +`>`, embeds: [ticketEmbed], components: [row]}).then(msg => {
msg.pin()
}) 


  }
    if(button.customId == "ticket_geri") {

const row = new MessageActionRow()
			.addComponents(
    new MessageButton()
      .setStyle("SECONDARY")
      .setLabel("Close")
.setEmoji('❌') 
      .setCustomId("ticket_kapat")
);
const embed = new Discord.MessageEmbed() 
.setDescription('You can click on the button below to take any action about Ticket.') 
.setColor('#FF7F00') 
button.update({embeds: [embed], components: [row]})

}
    if(button.customId == "ticket_kapat") {

const embed = new Discord.MessageEmbed() 
.setDescription(`🔓 - Ticket opens it back. 
❌ - Ticket deletes completely. 
📜 - Backs up Ticket messages into a txt file.
`)
.setColor('#0099ff')
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle("PRIMARY")
.setLabel("")
.setEmoji("🔓")
.setCustomId("ticket_geri"), 
    new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("❌")
.setCustomId("ticket_sil"), 
new MessageButton() 
.setStyle("SUCCESS")
.setLabel("")
.setEmoji("📜")
.setCustomId("ticket_mesaj") 
) 
button.update({embeds: [embed], components: [row]})

} 
    if (button.customId == "ticket_sil") {
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle("PRIMARY")
.setLabel("")
.setEmoji("🔓")
.setDisabled(true) 
.setCustomId("ticket_geri"), 
    new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("❌")
.setDisabled(true)
.setCustomId("ticket_sil"), 
new MessageButton() 
.setStyle("SUCCESS")
.setLabel("")
.setEmoji("📜")
.setDisabled(true)
.setCustomId("ticket_mesaj") 
) 

const embed = new Discord.MessageEmbed() 
.setDescription('${await client.emoji.fetch(`yes`)} Ticket will be closed in 10 seconds...')
button.channel.send({embeds: [embed]}) 
const embed2 = new Discord.MessageEmbed() 
.setDescription('Deleting channel. You can\'t take any action!') 
.setColor('RED')
button.update({embeds: [embed2], components: [row]}) 
    setTimeout(() => {
      button.channel.delete().catch(e => {})
    }, 10000);


  }
    if(button.customId == "ticket_mesaj") {

let sj = await button.channel.messages.fetch({limit: 100})
let response = []
sj = sj.sort((a, b) => a.createdTimestamp - b.createdTimestamp)
sj.forEach((m) => {
if (m.author.bot) return
const attachment = m.attachments.first()
const url = attachment ? attachment.url : null
if (url !== null) {m.content = url}
    response.push(`${m.author.tag} | ${m.content}`)})
await button.channel.send({embeds: [new Discord.MessageEmbed()	
.setColor('#0099ff')
.setTitle('👍 I back up messages sent to Ticket...')]})
let attach = new Discord.MessageAttachment(Buffer.from(response.toString().replaceAll(',', '\n'), 'utf-8'),`${button.channel.name}.txt`)
setTimeout(async () => {await button.channel.send({ content: `${await client.emoji.fetch(`yes`)} \`${button.channel.name}\` I transferred ticket \'s messages to the file below.`, files: [attach]})}, 3000)

}   
    
    if(button.customId == "oylamaevet") {

if(await client.poll.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

button.reply({content: `${await client.emoji.fetch(`no`)} You responded NO to the survey! To give a YES reaction, withdraw the NO reaction.`, ephemeral: true})

} else {

if(await client.poll.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await client.poll.delete(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`) 

await client.poll.subtract(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]})  

} else {

await client.poll.set(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 

await client.poll.add(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]}) 

} 
}
}

if(button.customId == "oylamahayır") {

if(await client.poll.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

button.reply({content: `${await client.emoji.fetch(`no`)} You responded YES to the survey! To give a NO reaction, withdraw the YES reaction.`, ephemeral: true})

} else {

if(await client.poll.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await client.poll.delete(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`) 

await client.poll.subtract(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]}) 

} else {
await client.poll.set(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 

await client.poll.add(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]}) 

    

} 
}
}

    const { Op } = require("sequelize")

const { bold } = require("@discordjs/builders")

const { userMention, time: timestamp } = require("@discordjs/builders")


const db2 = require("./helpers/database-poll.js") 

if(button.customId == "oylamaevet_timed") {
const polldb2 = await client.poll.fetch(`poll_${button.message.id}`)

    const polldb = await db2.Polls.findOne({

    where: { uuid: polldb2 },

    })
if(await client.poll.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {
button.reply({content: `${await client.emoji.fetch(`no`)} You responded NO to the survey! To give a YES reaction, withdraw the NO reaction.`, ephemeral: true})
} else {

if(await client.poll.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await client.poll.delete(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`) 
await client.poll.subtract(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]})  

} else {

await client.poll.set(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 
await client.poll.add(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]}) 

} 
}
}

if(button.customId == "oylamahayır_timed") {
const polldb2 = await client.poll.fetch(`poll_${button.message.id}`)

    const polldb = await db2.Polls.findOne({

    where: { uuid: polldb2 },

    })
if(await client.poll.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {
button.reply({content: `${await client.emoji.fetch(`no`)} You responded YES to the survey! To give a NO reaction, withdraw the YES reaction.`, ephemeral: true})
} else {

if(await client.poll.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await client.poll.delete(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`) 
await client.poll.subtract(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]}) 

} else {

await client.poll.set(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 
await client.poll.add(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = await client.poll.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = await client.poll.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = await client.poll.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
${await client.emoji.fetch(`message`)} 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]}) 
    
} 
}
} 


if (button.customId === "buton_rol") {

let rol = await client.buttonrole.fetch(`buton_rol_${button.message.id}_${button.guild.id}`)

if (button.member.roles.cache.get(rol)) {

await button.member.roles.remove(rol);
button.reply({content: `${await client.emoji.fetch(`yes`)} I have successfully reclaimed the role of <@&`+ rol +`> from you.`, ephemeral: true}) 

} else {

await button.member.roles.add(rol);
button.reply({content: `${await client.emoji.fetch(`yes`)} I have successfully assigned you the role of <@&`+ rol +`>.`, ephemeral: true}) 

}

} 



if(button.customId === "onayli") {
if(await client.verifieduser.fetch(`onaylı_kullanıcı_başvuru_durum_${button.user.id}`) === 'yes') {
button.reply({content: `${await client.emoji.fetch(`no`)} You\'ve already applied!`, ephemeral: true})
} else {
    const moment = require('moment')
    let Category = "1012995198931980350" 
    let Role = "1012988618085769236" 
    const ticketChannel = await client.guilds.cache.get('752164000418234448').channels.create(
      `✅ - ${button.user.username}`,
      {
        name: "ticket",
        parent: Category,
        type: "text"
      }
    );
   ticketChannel.permissionOverwrites.create(Role, {
      VIEW_CHANNEL: true, 
     SEND_MESSAGES: true
    });
    ticketChannel.permissionOverwrites.create(button.guild.id, {  VIEW_CHANNEL: false })
button.reply({content: `${await client.emoji.fetch(`yes`)} The application was successfully made and will be returned within 24-48 hours! If no return is made, your application has been rejected.`, ephemeral: true}) 
    const ticketEmbed = new MessageEmbed()
      .setDescription(
        `Bilet hakkında herhangi bir işlem yapmak için aşağıdaki düğmeye tıklayabilirsiniz.
${await client.emoji.fetch(`yes`)} Hesap oluşturulma tarihi: ${moment.utc(button.guild.members.cache.get(button.user.id).user.createdAt).format('DD/MM/YYYY')}`
      );
const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle('SECONDARY')
.setLabel('Onayla')
.setEmoji('')
.setCustomId('onayla_kullanici'), 
new MessageButton() 
.setStyle('SECONDARY')
.setLabel('Reddet')
.setEmoji('')
.setCustomId('reddet_kullanici'), 
    new MessageButton()
      .setStyle("SECONDARY")
.setEmoji('❌') 
      .setLabel("")
      .setCustomId("ticket_kapat")
);
await client.verifieduser.set(`onaylı_kullanıcı_başvuru_durum_${button.user.id}`, `yes`) 
    ticketChannel.send({content: `<@&`+ Role +`>`, embeds: [ticketEmbed], components: [row]}).then(msg => {
msg.pin()
await client.verifieduser.set(`onaylı_kullanıcı_başvuru_${msg.id}`, button.user.id)
}) 
} 
} 

if(button.customId === "onayla_kullanici") {
let user = await client.verifieduser.fetch(`onaylı_kullanıcı_başvuru_${button.message.id}`) 
let u = client.users.cache.get(user) 
await client.verifieduser.set(`onaylı_kullanıcı_${user}`, `evet`)
await client.verifieduser.set(`onaylı_kullanıcı_rozet_${user}`, `${await client.emoji.fetch(`verfied`)}`)
await client.verifieduser.delete(`onaylı_kullanıcı_başvuru_${button.message.id}`)
const embed = new Discord.MessageEmbed() 
.setDescription('🎉 Approved user application accepted, congratulations! If you want, come to our support server below, send this message to the gallery channel and get a special role!') 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setEmoji('')
.setURL('https://discord.gg/VZWm9KKmCp') 
) 
button.reply({content: 'Başvuru kabul edildi!'}) 
u.send({embeds: [embed], components: [row]})
} 

if(button.customId === "reddet_kullanici") {
let user = await client.verifieduser.fetch(`onaylı_kullanıcı_başvuru_${button.message.id}`) 
let u = client.users.cache.get(user) 
await client.verifieduser.delete(`onaylı_kullanıcı_başvuru_durum_${user}`)
await client.verifieduser.delete(`onaylı_kullanıcı_başvuru_${button.message.id}`) 
const embed = new Discord.MessageEmbed() 
.setDescription(`😔 Unfortunately, your application was rejected! If you have a complaint, come to our support server below and report it.
Reason for rejection: The account wasn\'t opened a month ago. `) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setEmoji('')
.setURL('https://discord.gg/VZWm9KKmCp') 
) 
button.reply({content: 'Başvuru reddedildi!'}) 
u.send({embeds: [embed], components: [row]})
}

}) 

process.on("unhandledRejection", (reason, promise) => {
return console.log(reason)
}); 
