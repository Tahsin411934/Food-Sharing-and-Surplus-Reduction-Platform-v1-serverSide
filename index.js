const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// MIDDLEWARE

app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://PlateSawp:8hfbRPnE14lnWGiN@cluster0.2vutuar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const AvailableFoodDB = client.db('PlateSwap').collection('AvailableFood');
    app.post("/AvailableFood",async(req,res)=>{
        const AvailableFood= req.body;
        const result= await AvailableFoodDB.insertOne(AvailableFood)
        res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);











app.get("/", (req,res)=>{
        res.send('server is running');
    })

    app.listen(port, ()=>
        console.log('running port is ' , port )
    )