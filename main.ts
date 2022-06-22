import { Message, Client, Intents } from "discord.js"
import { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, getVoiceConnection } from "@discordjs/voice"
import * as ytmusic from "node-youtube-music"
import play from 'play-dl'
import express from "express"
import dotenv from 'dotenv'
dotenv.config()


const app = express();
app.set('port', (process.env.PORT || 5000))

//For avoidong Heroku $PORT error
app.get('/', function (request: express.Request, response: express.Response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'))
});

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

client.once('ready', () => {
    console.log('Ready!')
})

client.on("messageCreate", (msg: Message) => {
    if (msg.content.startsWith('@')) {
        try {
            commandDeploy(msg)
        } catch (error) {}
    }
})

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Play
    }
})

function commandDeploy(msg: Message) {
    if (!msg.member?.voice.channel) {
        msg.reply('Join a voice channel to use commands')
        return
    }
    const key = msg.content.split('@')[1].split(' ')[0]
    switch (key) {
        case 'p':
            playmusic(msg)
            break
        case 'pause':
            player.pause()
            msg.reply('Paused')
            break
        case 'resume':
            player.unpause()
            msg.reply('Resumed')
            break
        case 'stop':
            player.stop()
            msg.reply('Stopped')
            break
        case 'leave':
            getVoiceConnection(msg.guildId!!)?.disconnect()
            msg.reply('Bye Bye !!')
            break
        default:
            msg.reply('Command not found')
            break
    }
}

async function playmusic(msg: Message) {
    const voiceChannel = msg.member?.voice.channel!!
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })
    const query = msg.content.split('@p ')[1]
    let link = ""
    if (query.startsWith('https')) {
        link = query
    } else {
        const musics = await ytmusic.searchMusics(query)
        const musicid = musics[0].youtubeId
        if (!musicid) return
        link = 'https://www.youtube.com/watch?v=' + musicid
    }
    const info : any = await play.video_info(link)
    const title = info.video_details.title
    let stream = await play.stream(link)
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    })
    connection.subscribe(player)
    player.play(resource)
    msg.reply(`Playing ${title}`)
}

client.login(process.env.token)