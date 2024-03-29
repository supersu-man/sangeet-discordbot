import { SlashCommandBuilder } from "discord.js";

const playCommand = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addStringOption((option) => option.setName('title').setDescription('Search for music to play').setRequired(true))

const pauseCommand = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause music')

const resumeCommand = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume music')

const stopCommand = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music')

const leaveCommand = new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave voice channel')

const searchCommand = new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search music')
    .addStringOption((option) => option.setName('title').setDescription('Search music - get top 3 results').setRequired(true))

const commands = [playCommand, pauseCommand, resumeCommand, stopCommand, leaveCommand, searchCommand]

export { commands }