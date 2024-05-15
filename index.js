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
  origin: ['http://localhost:5173',
    'https://plateswap-96379.web.app',
    'https://plateswap-96379.firebaseapp.com',
    'https://plateswap.netlify.app'],
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


// middleware
const logger = (req, res, next) => {

  next()
}

const VerifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  console.log('middleware : ', token);
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded;
    next();
  })


}

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production" ? true : false,
};
async function run() {
  try {
    const FoodDB = client.db('PlateSwap').collection('AvailableFood');
    const MyRequestFoodsDB = client.db('PlateSwap').collection('MyRequestFoods');
    // const FeaturedFoodsDB = client.db('PlateSwap').collection('FeaturedFoods');



    // Auth related api

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log('user', user)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.cookie('token', token, cookieOptions).send({ success: true })
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



    app.get("/allFood/:email", logger, VerifyToken, async (req, res) => {
      const email = req.params.email;
      console.log('email from parms allfood', email)
      console.log(req.cookies)
      console.log('owner info', req.user)
      if (req.user.email !== email) {
        return res.status(403).send({ message: 'forbidden access data' })
      }

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

    app.get("/MyRequestFoods/:email", logger, VerifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      if (req.user.email !== email) {
        return res.status(403).send({ message: 'forbidden access data' })
      }
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

    app.post('/logout', async (req, res) => {
      const user = req.body;
      res.clearCookie('token', { ...cookieOptions, maxAge: 0 }).send({ success: true })
    })


    // await client.db("admin").command({ ping: 1 });
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