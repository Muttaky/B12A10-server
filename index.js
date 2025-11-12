let express = require("express");
let cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
let app = express();
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

const uri =
  "mongodb+srv://newDbUser:fLxrJrZSBBLe6rlD@cluster0.31jib4o.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.get("/", (req, res) => {
  res.send("hello world , I am a web developer");
});

async function run() {
  try {
    await client.connect();
    const cropsDB = client.db("cropsDB");
    const cropsColl = cropsDB.collection("crops");

    app.get("/crops", async (req, res) => {
      const cursor = cropsColl.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crops/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cropsColl.findOne(query);
      res.send(result);
    });

    app.post("/crops", async (req, res) => {
      const newCrop = req.body;
      console.log("crop info", newCrop);
      const result = await cropsColl.insertOne(newCrop);
      res.send(result);
    });

    app.patch("/crops/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCrop = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedCrop.name,
          type: updatedCrop.type,
          price: updatedCrop.price,
          unit: updatedCrop.unit,
          quantity: updatedCrop.quantity,
          description: updatedCrop.description,
          location: updatedCrop.location,
          image: updatedCrop.image,
        },
      };
      const options = {};
      const result = await cropsColl.updateOne(query, update, options);
      res.send(result);
    });

    app.delete("/crops/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cropsColl.deleteOne(query);
      res.send(result);
    });
    //await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

module.exports = app;
//fLxrJrZSBBLe6rlD
//newDbUser
