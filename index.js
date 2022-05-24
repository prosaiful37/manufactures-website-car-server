const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


//middel ware
app.use(cors());
app.use(express.json());












app.get('/', (req, res) => {
    res.send('Hello World from cart parts!')
  })
  
app.listen(port, () => {
    console.log(`car parts  port ${port}`)
})