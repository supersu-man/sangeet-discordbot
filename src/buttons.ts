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

const firstButton = new ButtonBuilder()
    .setCustomId('firstButton')
    .setLabel('Repeat')
    .setStyle(ButtonStyle.Primary);
const secondButton = new ButtonBuilder()
    .setCustomId('secondButton')
    .setLabel('Repeat')
    .setStyle(ButtonStyle.Primary);
const thirdButton = new ButtonBuilder()
    .setCustomId('thirdButton')
    .setLabel('Repeat')
    .setStyle(ButtonStyle.Primary);
export { pauseButton, playButton, repeatButton, stopButton, firstButton, secondButton, thirdButton }