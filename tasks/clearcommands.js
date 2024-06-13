const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.CLIENT_TOKEN);
const clientId = Buffer.from(process.env.CLIENT_TOKEN.split(".")[0], "base64").toString("utf8");

rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);