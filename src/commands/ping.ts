import { Command } from "../types/Interactions";
import { SlashCommandBuilder, EmbedBuilder, Embed } from 'discord.js';

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Responds with Pong!"),
    async execute(client, interaction) {
        return ({ embeds: [
            new EmbedBuilder().setDescription(`Ping! \`${client.ws.ping}ms\``)
            .setColor(0x52dc7e)
        ]});

        // client.ws.ping gets the ping from the Web Socket connected to the Discord API
    },
}

export = ping;