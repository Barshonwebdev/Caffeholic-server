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

// jwt create token function
function createToken(user) {
  const token = jwt.sign(
    {
      email: user.email,
    },
    "secret",
    { expiresIn: "7d" }
  );
  
  return token;
}

// jwt token verify function 
function verifyToken(req,res,next){
  const token=req.headers.authorization.split(' ')[1];
  const verify=jwt.verify(token,"secret");
  if(!verify?.email){
   return res.send('You are not authorized');
  }
  req.user=verify.email;
  console.log(verify);
  next();
}

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
      client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const caffeholicDB=client.db('caffeholic_db');
      const coffeepostsCollection=caffeholicDB.collection('coffeepost_collection');
      const userCollection=caffeholicDB.collection('caffeholic_users');

      // users api 
      // user APIs

    app.post("/user", async (req, res) => {
      const user = req.body;
      const token=createToken(user);
      console.log(token);
      const isUserExist = await userCollection.findOne({ email: user.email });
      if (isUserExist) {
        return res.send({
          message: "user already exists on database",
          token
        });
      }
      const result = await userCollection.insertOne(user);
      res.send({token});
    });
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

