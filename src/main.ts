import { Client, GatewayIntentBits, Events, REST, Routes, ChatInputCommandInteraction, GuildMember } from "discord.js"
import { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"
import * as ytmusic from "node-youtube-music"
import play from 'play-dl'
import dotenv from 'dotenv'
import { commands } from "./commands"
dotenv.config()

let voiceConnection: VoiceConnection

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.once(Events.ClientReady, () => { 
    console.log('Bot is Ready!')
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return
    if (!(interaction.member as GuildMember).voice.channel) {
        interaction.reply('Join a voice channel to use commands')
        return
    }
    switch (interaction.commandName) {
        case 'play':
            playmusic(interaction as ChatInputCommandInteraction)
            break
        case 'pause':
            player.pause()
            interaction.reply('Paused')
            break
        case 'resume':
            player.unpause()
            interaction.reply('Resumed')
            break
        case 'stop':
            player.stop()
            interaction.reply('Stopped')
            break
        case 'leave':
            if (voiceConnection?.state?.status == VoiceConnectionStatus.Ready) {
                interaction.reply('Leaving')
                voiceConnection.disconnect()
            }
            break
        default:
            break
    }
})

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Play
    }
})

async function playmusic(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.get('title')?.value as string
    const voiceChannel = (interaction.member as GuildMember).voice.channel!
    voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })
    let link = ""
    if (query.startsWith('https')) {
        link = query
    } else {
        const musics = await ytmusic.searchMusics(query)
        const musicid = musics[0].youtubeId
        if (!musicid) return
        link = 'https://www.youtube.com/watch?v=' + musicid
    }
    try {
        console.log(link)
        const info: any = await play.video_info(link)
        const title = info.video_details.title
        interaction.reply(`Playing ${title}`)
        let stream = await play.stream(link)
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })
        voiceConnection.subscribe(player)
        player.play(resource)
    } catch (error) {
        interaction.reply(`Error with the link`)
    }
}

async function main() {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.token as string)
        await rest.put(Routes.applicationCommands(process.env.client_id as string), {
            body: commands
        })
        client.login(process.env.token)
    } catch (err) {
        console.log(err)
    }
}

main()