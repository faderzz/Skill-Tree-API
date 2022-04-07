const { MongoClient } = require("mongodb");
require("dotenv").config();

// Replace the uri string with your MongoDB deployment's connection string.
const client = new MongoClient(process.env.DB_KEY);

async function run() {
    try {
        await client.connect();
        const database = client.db('Database');
        const skills = database.collection('Skills');

        const query = { title: 'MEDITATION' };
        const skill = await skills.findOne(query);
        console.log(skill);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
