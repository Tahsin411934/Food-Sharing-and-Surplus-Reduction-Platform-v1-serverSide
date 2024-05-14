const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cokieParser = require('cookie-parser')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// MIDDLEWARE

app.use(cors({
  origin:['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cokieParser())

 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2vutuar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const MyRequestFoodsDB = client.db('PlateSwap').collection('MyRequestFoods');
    // const FeaturedFoodsDB = client.db('PlateSwap').collection('FeaturedFoods');



    // Auth related api

    app.post("/jwt", async(req,res)=>{
      const user = req.body;
      console.log(user)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
      res
      .cookie('token', token , {
        httpOnly:true,
        secure: false,
        sameSite: 'none'
      })
      .send({success : true})
    })

 
    // service related api  
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



    app.get("/allFood/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email)
      const query = { donator_email: email };
      const result = await FoodDB.find(query).toArray();
      res.send(result);
    });


    app.get('/Food/:status', async (req, res) => {
      const status = req.params.status;
      const quary = { Food_Status: status }
      const result = await FoodDB.find(quary).toArray()
      result.sort((a, b) => parseInt(b.food_quantity) - parseInt(a.food_quantity));
      res.send(result)
    })



    app.post("/Food", async (req, res) => {
      const AvailableFood = req.body;
      const result = await FoodDB.insertOne(AvailableFood)
      res.send(result)
    })

    app.get("/MyRequestFoods/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email : email };
      const result = await MyRequestFoodsDB.find(query).toArray();
      res.send(result);
    });
 
       

    app.post("/MyRequestFoods", async (req, res) => {
      const MyRequestFoods = req.body;
      const result = await MyRequestFoodsDB.insertOne(MyRequestFoods)
      res.send(result)
    })

  


    app.delete("/Food/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await FoodDB.deleteOne(query);
      res.send(result)
    })






    app.put("/Food/:id", async (req, res) => {
      const id = req.params.id;
      const Food = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upset: true };
      const updatedFood = {
        $set: {
          Food_Status: Food.Food_Status,
          additional_notes: Food.additional_notes,
          food_name: Food.food_name,
          food_quantity: Food.food_quantity,
          pickup_location: Food.pickup_location,
          expired_datetime: Food.expired_datetime,
          food_image: Food.food_image,
          Discount: Food.Discount,

        }
      }
      const result = await FoodDB.updateOne(filter, updatedFood, options);
      res.send(result)
    })

    app.post('/logout', async(req,res)=>{
      const user = req.body;
      res.clearCookie('token', {maxAge: 0 }).send({success:true})
    })
 

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);











app.get("/", (req, res) => {
  res.send('server is running');
})

app.listen(port, () =>
  console.log('running port is ', port)
)