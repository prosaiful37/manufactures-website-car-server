const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const stripe = require('stripe')('process.env.STRIPE_SECRETE_KEY')

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
    const usersCollection = client.db('car_parts').collection('users');


    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result)
      
    });


    app.get('/users', async(req, res) => {
      const users = await usersCollection.find().toArray()
      res.send(users);
    })

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


    app.get('/orders', async(req, res ) => {
      const userEmail = req.query.email;
      const query = {email: userEmail};
      const parts = await orderCollection.find(query).toArray();
      res.send(parts);
    })


    app.post('/orders', async(req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order)
      res.send(result);
      
    })


    app.delete('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })


    app.get('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const query  = {_id: ObjectId(id)};
      const order =  await orderCollection.findOne(query);
      res.send(order)
    })


    app.post("/create-payment-intent", async(req, res) =>{
        const order = req.body;
        const price = order.price;
        const amount = price*100;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_methods_type:['card']
        });
        res.send({clientSecret: paymentIntent.client_secret})
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
