const { REST } = require('@discordjs/rest')
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Routes } = require('discord-api-types/v9')
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
const { mongoClient, connectToMongoDB, closeMongoDBConnection } = require('./database.js');

const fs = require('fs')
const path = require('path')

let commandTmp = []
let commands = []

// require('dotenv').config({
//     path: path.join(__dirname, '.env'),
// })
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const token = process.env.TOKEN_PROD;

client.once('ready', () => {
    console.log('Bot Ready!')

    let commandsFiles = fs.readdirSync(path.join(__dirname, './commands'))

    commandsFiles.forEach((file, i) => {
        commandTmp[i] = require('./commands/' + file)
        commands = [
            ...commands,
            {
                name: file.split('.')[0],
                description: commandTmp[i].description,
                init: commandTmp[i].init,
                options: commandTmp[i].options,
            },
        ]
    })

    const rest = new REST({ version: '9' }).setToken(token)
    rest.put(Routes.applicationCommands(client.application.id), {
        body: commands,
    })
        .then(() => {
            console.log('Commands registered!')
        })
        .catch(console.error)
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return
    const { commandName } = interaction
    const selectedCommand = commands.find(c => commandName === c.name)
    selectedCommand.init(interaction, client)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  connectToMongoDB();
});

client.login(token)

// Listen for process termination events and close MongoDB connection
process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing MongoDB connection.');
    closeMongoDBConnection().then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});
