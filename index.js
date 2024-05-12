const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const FoodDB = client.db('PlateSwap').collection('AvailableFood');
    // const MyRequestFoodsDB = client.db('PlateSwap').collection('MyRequestFoods');
    // const FeaturedFoodsDB = client.db('PlateSwap').collection('FeaturedFoods');

    app.get("/Food", async (req, res) => {
        const find = FoodDB.find({});
        const result = await find.toArray();
        result.sort((a, b) => parseInt(b.food_quantity) - parseInt(a.food_quantity));
        res.send(result)
    });
 
 
    app.get('/Foods/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }
      const result = await FoodDB.findOne(quary)
      res.send(result)    
  });

  


    app.post("/Food",async(req,res)=>{
        const AvailableFood= req.body;
        const result= await FoodDB.insertOne(AvailableFood)
        res.send(result)
    })



    app.get('/Food/:status', async (req, res) => {
      const status = req.params.status;
      const quary = { Food_Status: status }
      const result = await FoodDB.find(quary).toArray()
      result.sort((a, b) => parseInt(b.food_quantity) - parseInt(a.food_quantity));
      res.send(result)    
  });


    // app.post("/MyRequestFoods",async(req,res)=>{
    //     const RequestedFoodsDB= req.body;
    //     const result= await MyRequestFoodsDB.insertOne(RequestedFoodsDB)
    //     res.send(result)
    // })


   

  //   app.delete("/Food/:id", async (req, res) => {
  //     const id = req.params.id;
  //     console.log(id)
  //     const query = { _id: new ObjectId(id) };
  //     const result = await FoodDB.deleteOne(query);
  //     res.send(result)
  // })




  app.put("/AvailableFood/:id",async (req, res) => {
    const id = req.params.id;
    const Food= req.body;
    const filter = { _id: new ObjectId(id) };
    const options = {upset: true};
    const updatedFood = {
      $set: {
        Food_Status: Food.Food_Status,
        
      }
    }
    const result = await FoodDB.updateOne(filter,updatedFood,options);
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