const { mongoClient } = require('../database.js'); // Import the MongoDB client
const { ApplicationCommandOptionType } = require('discord.js');
const USER = ApplicationCommandOptionType.User;

const description = 'Clear the database';

const options = [];

const init = async (interaction, client) => {
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    console.log('Connected to MongoDB!');

    // Get a reference to the 'user_data' collection
    const db = mongoClient.db('bookiebot'); // Replace with your database name
    const collection = db.collection('user_data'); // Replace with your collection name

    // Clear the entire collection
    const result = await collection.deleteMany({});

    if (result && result.acknowledged) {
      interaction.reply('Database cleared.');
    } else {
      console.error('Failed to clear database. Result:', result);
      interaction.reply('Failed to clear database.');
    }
  } catch (error) {
    console.error('Error clearing database:', error);
    interaction.reply('Error clearing database: ' + error.message);
  } finally {
    // Close the MongoDB connection
    await mongoClient.close();
  }
};

module.exports = { init, description, options };
