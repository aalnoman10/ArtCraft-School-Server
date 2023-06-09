const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000
const app = express()

// middelware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.hrkpt8c.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // COLLECTION
        const usersCollection = client.db("artCraftDB").collection("users")
        const instructorsCollection = client.db("artCraftDB").collection("instructors")
        const classesCollection = client.db("artCraftDB").collection("classes")

        //USERS COLLECTION
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email }

            const finding = await usersCollection.findOne(query);
            if (finding) {
                res.send({ m: "user already added" })
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result)
            }
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server run')
})


app.listen(port, () => {
    console.log(`listen ${port}`);
})