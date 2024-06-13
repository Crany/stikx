import {
    Client, IntentsBitField, 
    Events, Routes, REST, time
} from 'discord.js';

import { Command } from './types/Interactions';
import { RegisterCommands } from './types/Client';

import fs from 'node:fs';
import path from 'node:path';
import { EmbedBuilder } from '@discordjs/builders';

const GatewayIntentBits = IntentsBitField.Flags;

export default class ExtendedClient extends Client<true> {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.Guilds
            ]
        })
    }

    public commands: Map<string, Command> = new Map<string, Command>(); // Command_Name, Command
    private cooldown: Map<string, Date> = new Map<string, Date>(); // User_ID, date
    private clientId = Buffer.from(process.env.CLIENT_TOKEN!.split(".")[0], "base64").toString("utf8");

    public init() {
        this.register({ clientId: this.clientId, guildId: process.env.GUILD_ID!, clientToken: process.env.CLIENT_TOKEN! }).then(() => { // Register Slash Commands
            console.log("Connecting to the Client..."); // Blue
            this.login(process.env.CLIENT_TOKEN).then(() => {
                console.log(`${this.user.username} is now online.`); // Green
                console.log("App Console:\n")
                this.listen();
            }).catch((e) => {
                console.log("> There was an error logging into the Discord client."); // Red
                throw new Error(e);
            });
        });
    }

    private async listen() {
        this.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return
            else if (this.cooldown.get(interaction.user.id)) {
                let Time = this.cooldown.get(interaction.user.id)!.getTime() + 20000;
                let date = new Date(Time);

                interaction.reply({ embeds: [
                    new EmbedBuilder().setTitle('Woah! Slow down!')
                    .setDescription(`You can run your next command ${time(date, 'R')}`)
                    .setColor(0xe67e22)
                ], ephemeral: true })
                return;
            }

            this.cooldown.set(interaction.user.id, new Date())
            setTimeout(() => {
                this.cooldown.delete(interaction.user.id)
            }, 20000) // 20 seconds

            const command = this.commands.get(interaction.commandName);

            if (!command) {
                console.error(`${interaction.user.tag} (ID: ${interaction.user.id}) tried to run an unknown command. (${interaction.commandName})`);
                interaction.reply({ content: 'Hmmm, seems like there was an error with that command. The dev team has been notified.', ephemeral: true })
                return
            }

            try { // Checking if the user has requested for the command to silent, and doing so if it is a forced
                  // ephemeral command or the user has requested it to be
                const reply = command.execute(this, interaction);
                const ephemeral = interaction.options.getBoolean("silent")

                if (ephemeral == true || command.ephemeral) (await reply).ephemeral = true;
                if (interaction.deferred) await interaction.editReply(await reply);
                else if (interaction.replied) await interaction.followUp(await reply);
                else interaction.reply(await reply);
            } catch (e) {
                console.error(e);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Hmmm, seems like there was an error with that command. The dev team has been notified.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Hmmm, seems like there was an error with that command. The dev team has been notified.', ephemeral: true });
                }
            }
        });
    }

    private async register({guildId, clientId, clientToken}: RegisterCommands) {
        console.log("Registering Commands..."); // Blue

        // Find commands
        const commandPath = path.join(__dirname, "commands");
        let totalCommands = 0;
        const commandDatas: any = [];

        const commands = fs.readdirSync(`${commandPath}`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        totalCommands += commands.length;

        for (const file of commands) {
            const command: Command = await import(`${commandPath}/${file}`);
            this.commands.set(command.data.name, command);
        }
        
        // Automatically adding "silent" option to each command
        this.commands.forEach((command) => {
            if (!command.ephemeral) {
                command.data.addBooleanOption((option => 
                    option.setName("silent")
                    .setDescription("Whether or not the command is ephemeral")
                ))
            }

            commandDatas.push(command.data.toJSON());
        })

        // Register the commands to the Discord API
        console.log(`> Started refreshing ${totalCommands} application (/) commands`); // Blue
        
        const rest = new REST().setToken(clientToken);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandDatas }
        ).catch(e => {
            console.log("> There was an error registering the commands."); // Red
            console.log("\x1b[0m");

            console.error(e);
            throw new Error(e);
        })

        console.log(`> Successfully reloaded application (/) commands.`); // Green
    }
}