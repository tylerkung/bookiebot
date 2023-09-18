const description = 'Show Ledger'

// const { mongoClient, closeMongoDBConnection } = require('mongodb'); // Replace with the correct path
const { mongoClient, connectToMongoDB, closeMongoDBConnection } = require('../database.js');

const init = async (interaction, client) => {
  try {
    await connectToMongoDB(); // Connect to MongoDB

    const collection = mongoClient.db("bookiebot").collection("user_data"); // Replace "mydb" and "user_data" with your actual database and collection names

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Check if there's data in the collection
    if (data.length === 0) {
      interaction.reply('The collection is empty.');
      return;
    }

    // Format the data into a table
    const table = [['User ID', 'Balance']];
    data.forEach((item) => {
      table.push([item.user_id, item.balance.toFixed(2)]);
    });

    // Display the formatted table
    interaction.reply(table.map((row) => row.join('\t')).join('\n'));
  } catch (error) {
    console.error('Error fetching data:', error.message);
    interaction.reply('Error fetching data.');
  } finally {
    await closeMongoDBConnection(); // Close the MongoDB connection
  }
};



module.exports = { init, description }
