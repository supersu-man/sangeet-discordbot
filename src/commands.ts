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

const commands = [playCommand, pauseCommand, resumeCommand, stopCommand, leaveCommand]

export { commands }