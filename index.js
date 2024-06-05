// server node packages requires
const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middlewares
app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_CLUSTER_URL}`;


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const caffeholicDB=client.db('caffeholic_db');
      const coffeepostsCollection=caffeholicDB.collection('coffeepost_collection');
      const userCollection=caffeholicDB.collection('caffeholic_users');

      // coffeeposts api 

      

      app.get('/coffeeposts',async(req,res)=>{
        const result=await coffeepostsCollection.find().toArray();
        res.send(result);
      })

    } finally {
      // Ensures that the client will close when you finish/error
      
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('running');
})

app.listen(port,()=>{
    console.log(`listening at port: ${port}`);
})

