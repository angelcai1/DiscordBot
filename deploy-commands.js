const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

//Slash commands
const commands = [
    new SlashCommandBuilder().setName('tictactoe').setDescription('Play a game of tic-tac-toe'),
]

//Define rest object so we can interact with discord API
const rest = new REST({ version: '9'}).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands.map(command => command.toJSON())})
    .then(() => console.log('Sucessfully registed application commands'))
    .catch(console.error);
