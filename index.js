let express = require("express");
let cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
let app = express();
let port = process.env.port || 3000;

app.use(cors());
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
    app.post("/crops", async (req, res) => {
      const newCrop = req.body;
      console.log("crop info", newCrop);
      const result = await cropsColl.insertOne(newCrop);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

//fLxrJrZSBBLe6rlD
//newDbUser
