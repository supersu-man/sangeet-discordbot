import discord
from discord.ext import commands
import youtube_dl
from ytmusicapi import YTMusic
import requests
from bs4 import BeautifulSoup

client = commands.Bot(command_prefix="@")

youtube_dl.utils.bug_reports_message = lambda: ''

def get_music_link(query):
    ytmusic = YTMusic()
    search_results = ytmusic.search(query)
    for i in search_results:
        if i['resultType'] == 'song':
            return "https://www.youtube.com/watch?v=" + i['videoId']
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

def get_link_details(link):
    x = youtube_dl.YoutubeDL().extract_info(link, download=False)
    url = x['formats'][0]['url']
    artist = 'No Artist'
    try:
        artist = x['artist']
    except: pass
    title = x['title']
    for i in x['formats']:
        if i['format_id'] == '251':
            url = i['url']
    return url, title, artist

def getLyrics(title):
    headers = {
        "user-agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36"
    }
    session = requests.Session()
    res = session.get("https://www.musixmatch.com/search/"+title, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    link = soup.find(class_ = "title").attrs["href"]
    res = session.get('https://www.musixmatch.com/'+link, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    lyrics=""
    for i in soup.find_all(class_ = "lyrics__content__ok"):
        lyrics += i.text+'\n'
    return lyrics

def splitLyrics(lyrics):
    ar = lyrics.split('\n')
    new = ""
    new_ar = []
    for i in range(len(ar)):
        temp = new+ar[i]+"\n"
        if(len(temp) > 2000) or i==len(ar)-1:
            new_ar.append(new)
            new = ""
        new += ar[i]+"\n"
    return new_ar

async def postLyrics(ctx,lyrics):
    if 'sangeet-lyrics' in str(ctx.guild.text_channels):
        channel  = discord.utils.get(ctx.guild.text_channels, name = 'sangeet-lyrics')
        await channel.send('x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x')
        if len(lyrics) > 2000:
            new = splitLyrics(lyrics)
            for message in new:
                await channel.send(message)
        else:
            await channel.send(lyrics)
        await channel.send('x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x')

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
    search_query = ' '.join(query)
    FFMPEG_OPTS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5', 'options': '-vn'}
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    await join(ctx, voice)
    voice = discord.utils.get(client.voice_clients, guild=ctx.guild)
    details = ""
    if('http' in search_query):
        video_id = search_query.split('v=')[1].split('&')[0]
        details = get_link_details('https://www.youtube.com/watch?v='+video_id)
    else:
        link = get_music_link(search_query)
        details = get_link_details(link)
    try:
        if voice.is_playing():
            voice.stop()
    except:
        pass

    await ctx.send("Playing " + details[1] + " by " + details[2])
    voice.play(discord.FFmpegPCMAudio(details[0], **FFMPEG_OPTS))
    voice.is_playing()
    lyrics = getLyrics(details[1])
    await postLyrics(ctx,lyrics)


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

#Uncomment below lines if you want to run bot on replit else comment them

"""from keep_alive import keep_alive
import os
keep_alive()
client.run(os.environ['key'])"""

#Uncomment below lines if you want to run bot on your machine else comment them

from key import key
client.run(key)