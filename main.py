import discord
from discord.ext import commands
import youtube_dl
from discord.utils import get
from ytmusicapi import YTMusic
from key import key

client = commands.Bot(command_prefix="@")

youtube_dl.utils.bug_reports_message = lambda: ''


def get_music_link(query):
    ytmusic = YTMusic()
    search_results = ytmusic.search(' '.join(query))
    for i in search_results:
        if i['resultType'] == 'song':
            return "https://www.youtube.com/watch?v=" + i['videoId']
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'


def get_link_details(link):
    x = youtube_dl.YoutubeDL().extract_info(link, download=False)
    url = x['formats'][0]['url']
    artist = x['artist']
    title = x['title']
    for i in x['formats']:
        if i['format_id'] == '251':
            url = i['url']
    return url, title, artist


async def join(ctx, voice):
    channel = ctx.author.voice.channel

    try:
        if voice and voice.is_connected():
            await voice.move_to(channel)
        else:
            voice = await channel.connect()
    except:
        pass


@client.command()
async def p(ctx, *query):
    FFMPEG_OPTS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5', 'options': '-vn'}

    voice = get(client.voice_clients, guild=ctx.guild)

    await join(ctx, voice)

    voice = get(client.voice_clients, guild=ctx.guild)

    link = get_music_link(query)
    details = get_link_details(link)

    try:
        if voice.is_playing():
            voice.stop()
    except:
        pass

    await ctx.send("Playing " + details[1] + " by " + details[2])
    voice.play(discord.FFmpegPCMAudio(details[0], **FFMPEG_OPTS))
    voice.is_playing()


@client.command()
async def search(ctx, *query):
    if 'https' not in query:
        await ctx.send(get_music_link(query))


@client.command()
async def leave(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    if voice.is_connected():
        await ctx.send("Bye bye!!")
        await voice.disconnect()


@client.command()
async def pause(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    if voice.is_playing():
        await ctx.send("Paused")
        voice.pause()


@client.command()
async def resume(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    if voice.is_paused():
        await ctx.send("Resumed")
        voice.resume()


@client.command()
async def stop(ctx):
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    await ctx.send("Stopped")
    voice.stop()


client.run(key)
