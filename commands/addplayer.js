const { mongoClient } = require('../database.js'); // Import the MongoDB client
const { ApplicationCommandOptionType } = require('discord.js');
const USER = ApplicationCommandOptionType.User;

const description = 'Add player to database';

const options = [
  {
    name: 'user',
    description: 'Specify user',
    required: true,
    type: USER,
  },
];

const init = async (interaction, client) => {
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    console.log('Connected to MongoDB!');

    // Get a reference to the 'user_data' collection
    const db = mongoClient.db('bookiebot'); // Replace with your database name
    const collection = db.collection('user_data'); // Replace with your collection name

    // User data to insert
    const user = interaction.options.getUser('user');
    const username = user.globalName; // Get the username from the User object
    const balance = 0.00; // Replace with the user's balance
    const bonus = 0.00;
    const earnings = 0.00;

    // Insert the user into the 'user_data' collection
    const result = await collection.insertOne({
      user_id: username,
      balance: balance,
      bonus: bonus,
      earnings: earnings,
    });

    if (result && result.acknowledged) {
      interaction.reply(username + ' added to database.');
    } else {
      console.error('Failed to add player to database. Result:', result);
      interaction.reply('Failed to add player to database.');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    interaction.reply('Error inserting data: ' + error.message);
  } finally {
    // Close the MongoDB connection
    await mongoClient.close();
  }
};

module.exports = { init, description, options };
