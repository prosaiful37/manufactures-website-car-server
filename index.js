const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middel ware
app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svcpt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const partsCollection = client.db('car_parts').collection('parts');
    const orderCollection = client.db('car_parts').collection('orders');


    app.get('/parts', async(req, res) => {
        const query = {};
        const cursor = partsCollection.find(query)
        const parts = await cursor.toArray() 
        res.send(parts);
    })

    app.get('/parts/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const parts = await partsCollection.findOne(query);
      res.send(parts)
    })


    app.post('/orders', async(req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order)
      res.send(result);
      
    })





  } 
  finally {

  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World from cart parts!");
});

app.listen(port, () => {
  console.log(`car parts  port ${port}`);
});
