import { Command } from '../types/Interactions';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const fillstock: Command = {
    data: new SlashCommandBuilder()
        .setName("fillstock")
        .setDescription("Refills channel stock.")
        .addChannelOption(option => 
            option.setName("stock")
            .setDescription("The stock you want to fill.")
            .setRequired(true)
        ).addStringOption(option =>
            option.setName("code")
            .setDescription("The code for the stock you want to fill.")
            .setRequired(true)
        ),
    ephemeral: true,
    async execute(client, interaction) {
        const stock = interaction.options.getChannel("stock");
        const code = interaction.options.getString("code")

        return await { embeds: [new EmbedBuilder()
            .setDescription(`${stock} now has the CODE: \`${code}\``)
            .setColor(0x52dc7e)
        ]}
    },
}

export = fillstock;