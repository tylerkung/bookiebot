// mongoDB
// require('dotenv').config({
//     path: path.join(__dirname, '.env'),
// })
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, 'example.env') })
const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB!");

    // Create the "user_data" collection if it doesn't exist
    const db = mongoClient.db("bookiebot"); // Replace with your database name
    const collections = await db.listCollections({ name: "user_data" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("user_data");
      console.log("Created 'user_data' collection.");
    } else {
      // Collection exists, so you can console.log its contents here
      const userDataCollection = db.collection("user_data");

      const userData = await userDataCollection.find({}).toArray();
      console.log("Contents of 'user_data' collection:", userData);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function closeMongoDBConnection() {
  try {
    await mongoClient.close();
    console.log("Closed MongoDB connection.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}
run().catch(console.dir);

module.exports = { connectToMongoDB, closeMongoDBConnection, mongoClient };
