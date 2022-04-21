const { Client, Intents, Interaction, MessageActionRow, MessageButton } = require('discord.js');
const{ token } = require('./config.json')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

client.once('ready', () => {
    console.log('Angel\'s bot is ready!!!!!!');
})

client.on('messageCreate', (message) => {
    if (message.author.id === client.user.id) return;

    if (message.content.toLowerCase() === "about angel") {
        message.reply("Hi! My name is Angel. I am currently in my last semester (Graduating May 2022) "
            + "pursuing a degree in Computer Science at Utah State University. My favorite language to code in is python. I can usually be found either at the gym or "
            + "in my room playing video games.")
    }

    if (message.content.toLowerCase() === "Angel's Socials") {
        message.reply(
          "Instagram:\n"
        + "https://github.com/angelcai1\n"
        + "LinkedIn:\n"
        + "https://www.linkedin.com/in/angel-cai-643023201/"
        + "GitHub:\n"
        + "https://github.com/angelcai1")
    }
})

/* Start Tic Tac Toe Game */
let EMPTY = Symbol("empty");
let PLAYER = Symbol("player");
let BOT = Symbol("bot");
let tictactoe_state

//Creates initial board for tictactoe
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

//Gets random int for bot to choose
function getRandomInt(max){
    return Math.floor(Math.random() * max);
}
//Game Logic for a draw or game is over
function isDraw() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++){
            if (tictactoe_state[row][col] == EMPTY){
                return false;
            }
        }
    }
    return true;
}
function isGameOver(){
    for (let row = 0; row < 3; row++) {
        if ((tictactoe_state[row][0] == tictactoe_state[row][1]) 
            && (tictactoe_state[row][1] == tictactoe_state[row][2]) 
            && (tictactoe_state[row][2] != EMPTY)) {
                return true;
            }
        
        if ((tictactoe_state[0][row] == tictactoe_state[1][row]) 
            && (tictactoe_state[1][row] == tictactoe_state[2][row])
            && (tictactoe_state[2][row] != EMPTY)) {
                return true;
            }
    }
    if (tictactoe_state[1][1] != EMPTY) {
        if ((tictactoe_state[0][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2])
            || (tictactoe_state[2][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2])){
            return true;
        }
    }
    return false;
}

//Player's move/player clicked on button
client.on('interactionCreate', async interaction => {
    if(!interaction.isButton()) return;
    if(!interaction.customId.startsWith('tictactoe')) return;

    // Player choice
    let parsedFields = interaction.customId.split('_')
    let row = parsedFields[1]
    let col = parsedFields[2]

    if (tictactoe_state[row][col] != EMPTY) {
        interaction.update({
            content: "This spot has already been taken",
            components: makeGrid()
        })
        return;
    }

    tictactoe_state[row][col] = PLAYER
    if(isGameOver()){
        interaction.update({
            content: "Congrats, You Won!!!!",
            components: []
        })
        return;
    }
    if(isDraw()){
        interaction.update({
            content: "draw!",
            components: makeGrid()
        })
        return;
    }
    

    // Bot choice
    let botRow
    let botCol
    do {
        botRow = getRandomInt(2)
        botCol = getRandomInt(2)
    } while(tictactoe_state[botRow][botCol] != EMPTY);

    tictactoe_state[botRow][botCol] = BOT;
    if(isGameOver()){
        interaction.update({
            content: "Sorry, You lost",
            components: makeGrid()
        })
        return;
    }
    if(isDraw()){
        interaction.update({
            content: "draw!",
            components: []
        })
        return;
    }
    

    interaction.update({
        components: makeGrid()
    })
})

//User has used /tictactoe command
client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'tictactoe') {
        tictactoe_state = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
        ]

        await interaction.reply({ content: 'Playing a game of tic-tac-toe!', components: makeGrid() });
    }
})
/* End Tic Tac Toe Game */

client.login(token)