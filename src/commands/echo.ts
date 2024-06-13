import { Command } from '../types/Interactions';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const echo: Command = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Repeats what you say!")
        .addStringOption(option => 
            option.setName("echo")
            .setDescription("What I will echo.")
            .setRequired(true)
        ),
    async execute(client, interaction) {
        const echo = await interaction.options.getString("echo");

        return { embeds: [
            new EmbedBuilder().setDescription(`${interaction.user} said "${echo}"`)
            .setColor(0x52dc7e)
        ] }
    },
}

export = echo;