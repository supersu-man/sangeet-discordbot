import { ButtonBuilder, ButtonStyle } from "discord.js";

const pauseButton = new ButtonBuilder()
    .setCustomId('pause')
    .setLabel('Pause')
    .setStyle(ButtonStyle.Primary);
const playButton = new ButtonBuilder()
    .setCustomId('play')
    .setLabel('Play')
    .setStyle(ButtonStyle.Primary);
const repeatButton = new ButtonBuilder()
    .setCustomId('repeat')
    .setLabel('Repeat')
    .setStyle(ButtonStyle.Primary);
const stopButton = new ButtonBuilder()
    .setCustomId('repeat')
    .setLabel('Repeat')
    .setStyle(ButtonStyle.Primary);

export { pauseButton, playButton, repeatButton, stopButton}