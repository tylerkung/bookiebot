const db = require('../database.js'); // Import the database module
const DiscordJS = require('discord.js')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const NUMBER = ApplicationCommandOptionType.Number
const USER = ApplicationCommandOptionType.User
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

const description = 'Set Balance for user'

const options = [
  {
    name: 'user',
    description: 'Specify user',
    required: true,
    type: USER,
  },
  {
    name: 'number1',
    description: 'Set new balance',
    required: true,
    type: NUMBER,
  }
]
const init = (interaction, client) => {
  const user = interaction.options.getUser('user');
  const userName = user.globalName;
  const inputNum = interaction.options.getNumber('number1');
  const fixedInput = parseFloat(inputNum.toFixed(2));
  const formattedUSD = fixedInput.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  interaction.reply(`Setting ` + userName + `'s balance to ` + formattedUSD);
}


// // Command to set a user's number value
// client.on('message', (message) => {
//   if (message.content.startsWith('!setnumber')) {
//     const userId = message.author.id;
//     const args = message.content.split(' ');
//
//     if (args.length !== 2) {
//       message.reply('Please provide a single number value after the command.');
//       return;
//     }
//
//     const newValue = parseFloat(args[1]);
//
//     if (isNaN(newValue)) {
//       message.reply('Invalid number format. Please provide a valid number.');
//       return;
//     }
//
//     // Store the number value in the database
//     db.run('INSERT OR REPLACE INTO user_data (user_id, number_value) VALUES (?, ?)', [userId, newValue], (err) => {
//       if (err) {
//         console.error('Error storing user data:', err.message);
//         message.reply('An error occurred while saving your data.');
//       } else {
//         message.reply(`Number value set to: ${newValue}`);
//       }
//     });
//   }
// });
//
// // Command to get a user's number value
// client.on('message', (message) => {
//   if (message.content.startsWith('!getnumber')) {
//     const userId = message.author.id;
//
//     // Retrieve the user's number value from the database
//     db.get('SELECT number_value FROM user_data WHERE user_id = ?', [userId], (err, row) => {
//       if (err) {
//         console.error('Error retrieving user data:', err.message);
//         message.reply('An error occurred while fetching your data.');
//       } else if (row) {
//         const userNumber = row.number_value;
//         message.reply(`Your number value is: ${userNumber}`);
//       } else {
//         message.reply('You haven\'t set a number value yet.');
//       }
//     });
//   }
// });


module.exports = { init, description, options }
