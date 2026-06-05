const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


app.get('/', (req, res) =>{

    res.send("Hello This is My First Express Server.");
});



app.listen(port, () =>{
    console.log(`Your Server is Running on http://localhost:${port}`);
})


const uri = process.env.AUTH_DB_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db('simpleCrud');
    const userCollection = database.collection('user');


    // এখানে রাউট হ্যান্ডলার বা DB কল করা যেতে পারে
    app.get('/user', async (req, res) => {

        const cursor = userCollection.find({});
        const result = await cursor.toArray();
        res.send(result);

    });

    app.get('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.findOne(query);
        res.send(result);
    });

    app.delete('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    });


  } catch (err) {
    console.error(err);
  }
}
run();