// Common imports //
import { Client } from 'discord.js';

// Middlware //

// Slash Commands //
import { ChatInputCommandInteraction, InteractionReplyOptions} from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder;
    ephemeral?: boolean;
    execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<InteractionReplyOptions>;
}