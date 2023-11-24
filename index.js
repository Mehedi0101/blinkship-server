const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gxsfvvy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // collections
        const userCollection = client.db("BlinkShip").collection("users");



        // testing
        app.get('/', (req, res) => {
            res.send('BlinkShip server is running');
        })



        // users
        // inserting new user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const alreadyExist = await userCollection.findOne(query);
            if (!alreadyExist) {
                const result = await userCollection.insertOne(user);
                res.send(result);
            }
            else {
                res.send({ insertedId: true });
            }
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.log);

app.listen(port, () => {
    console.log(`BlinkShip server is running on port ${port}`);
})
