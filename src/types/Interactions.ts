// Common imports //
import ExtendedClient from '../client';

// Slash Commands //
import { ChatInputCommandInteraction, InteractionReplyOptions} from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder; // Slash command data
    ephemeral?: boolean; // Override for the "silent" interaction option
    execute: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => Promise<InteractionReplyOptions>; // Where the command code is actually executed
}; // Figure out how tf to get subcommands to work with InteractionReplyOptions and SlashCommandOptionsOnlyBuilder