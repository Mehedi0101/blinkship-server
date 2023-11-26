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
        const parcelCollection = client.db("BlinkShip").collection("parcels");



        // testing
        app.get('/', (req, res) => {
            res.send('BlinkShip server is running');
        })



        // users
        // getting all users
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        // getting all deliverymen
        app.get('/users/deliverymen', async (req, res) => {
            const query = { role: 'deliveryMen' };
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })

        // getting user by email
        app.get('/users/:email', async (req, res) => {
            const email = req?.params?.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // getting user type by email
        app.get('/users/type/:email', async (req, res) => {
            const email = req?.params?.email;
            const query = { email: email };
            const options = {
                projection: { _id: 0, role: 1 },
            };
            const result = await userCollection.findOne(query, options);
            res.send(result);
        })

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

        // updating an existing user
        app.patch('/users/:email', async (req, res) => {
            const query = { email: req.params.email };
            const updatedImage = {
                $set: {
                    image: req.body.image
                },
            };
            const result = await userCollection.updateOne(query, updatedImage);
            res.send(result);
        })

        // updating a user role by admin
        app.patch('/users/admin/update/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const updatedRole = {
                $set: {
                    role: req.body.role
                }
            }
            const result = await userCollection.updateOne(query, updatedRole);
            res.send(result);
        })



        // parcels
        // get all parcels
        app.get('/parcels', async (req, res) => {
            const result = await parcelCollection.find().toArray();
            res.send(result);
        })

        // get parcel by id
        app.get('/parcels/id/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await parcelCollection.findOne(query);
            res.send(result);
        })

        // get parcel by email
        app.get('/parcels/email/:email', async (req, res) => {
            const query = { email: req.params.email };
            const result = await parcelCollection.find(query).toArray();
            res.send(result);
        })

        // post a new parcel
        app.post('/parcels', async (req, res) => {
            const parcel = req.body;
            const result = await parcelCollection.insertOne(parcel);
            res.send(result);
        })

        // update a parcel
        app.patch('/parcels/update/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const updatedParcel = {
                $set: {
                    senderPhone: req.body.senderPhone,
                    parcelType: req.body.parcelType,
                    weight: req.body.weight,
                    receiver: req.body.receiver,
                    receiverPhone: req.body.receiverPhone,
                    deliveryAddress: req.body.deliveryAddress,
                    requestedDate: req.body.requestedDate,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                    price: req.body.price
                },
            };
            const result = await parcelCollection.updateOne(query, updatedParcel);
            res.send(result);
        })

        // update a parcel by admin
        app.patch('/parcels/admin/update/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            console.log(req.body.deliveryManId,
                req.body.approximateDate,
                req.body.status);

            const updatedParcel = {
                $set: {
                    deliveryManId: req.body.deliveryManId,
                    approximateDate: req.body.approximateDate,
                    status: req.body.status
                }
            }

            const result = await parcelCollection.updateOne(query, updatedParcel);
            res.send(result);
        })

        // delete a parcel
        app.delete('/parcels/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await parcelCollection.deleteOne(query);
            res.send(result);
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
