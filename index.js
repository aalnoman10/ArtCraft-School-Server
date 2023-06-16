const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const classesCollection = client.db("artCraftDB").collection("classes")
        const paymentCollection = client.db("artCraftDB").collection("payment")

        //USERS COLLECTION
        app.get("/users", async (req, res) => {

            const email = req.query?.email
            const instructors = req.query?.instructors

            if (email) {
                const queryWithEmail = { email }
                const result = await usersCollection.findOne(queryWithEmail)
                res.send(result)
            }
            else if (instructors) {
                const queryWithInstructor = { role: "instructor" }
                const result = await usersCollection.find(queryWithInstructor).toArray()
                res.send(result)
            }
            else {
                const result = await usersCollection.find().toArray();
                res.send(result)
            }
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

        app.patch("/users/:id", async (req, res) => {
            const role = req.body.role;
            const filter = { _id: new ObjectId(req.params.id) };

            const doc = {
                $set: {
                    role
                }
            };

            const result = await usersCollection.updateOne(filter, doc)
            res.send(result)
        })


        //CLASSES COLLECTION    

        app.get('/classes', async (req, res) => {
            const instructorEmail = req.query.instructorEmail

            if (instructorEmail) {
                const filter = { instructorEmail }
                const result = await classesCollection.find(filter).toArray()
                res.send(result)
            }
            else {
                const result = await classesCollection.find().toArray()
                res.send(result)
            }
        })

        app.get('/classes/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await classesCollection.findOne(query)
            res.send(result)
        })

        app.post('/classes', async (req, res) => {
            const newClass = req.body;

            const result = await classesCollection.insertOne(newClass)
            res.send(result)
        })

        app.put('/classes/:id', async (req, res) => {
            const status = req.body.status
            const query = { _id: new ObjectId(req.params.id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    status
                },
            };

            const result = await classesCollection.updateOne(query, updateDoc, options)
            res.send(result)
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