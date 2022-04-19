const { Client, Intents, Interaction, MessageActionRow, MessageButton } = require('discord.js');
const{ token } = require('./config.json')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

client.once('ready', () => {
    console.log('Angel\'s bot is ready!!!!!!');
})

client.on('messageCreate', (message) => {
    if (message.author.id === client.user.id) return;

    if (message.content === "ping") {
        message.reply("pong")
    }
})

/* Tic Tac Toe */
let EMPTY = Symbol("empty");
let PLAYER = Symbol("player");
let BOT = Symbol("bot");
let tictactoe_state

function makeGrid() {
    components = []
    for (let row = 0; row < 3; row++){
        actionRow = new MessageActionRow()
        for (let col = 0; col < 3; col++) {
            messageButton = new MessageButton()
                .setCustomId('tictactoe_' + row + '_' + col)
                
            switch(tictactoe_state[row][col]) {
                case EMPTY:
                    messageButton
                        .setLabel(' ')
                        .setStyle('SECONDARY')
                    break;
                case PLAYER:
                    messageButton
                        .setLabel('X')
                        .setStyle('PRIMARY')
                    break;
                case BOT:
                    messageButton
                        .setLabel('O')
                        .setStyle('DANGER')
                    break;
            }
            actionRow.addComponents(messageButton)
            
        }
        components.push(actionRow)
    }
    return components
}
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'tictactoe') {
        

        tictactoe_state = [
            [EMPTY, EMPTY, BOT],
            [EMPTY, EMPTY, EMPTY],
            [PLAYER, EMPTY, EMPTY],
        ]

        await interaction.reply({ content: 'Playing a game of tic-tac-toe!', components: makeGrid() });
    }

})
client.login(token)