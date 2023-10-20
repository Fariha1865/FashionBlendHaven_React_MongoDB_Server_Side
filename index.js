const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5jqcqmr.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("fashionDB");
        const brandCollection = database.collection("brands");
        const brandProductsCollection = database.collection("brandProducts");
        const cartProductsCollection = database.collection("cartProducts");

        app.get("/brands", async (req, res) => {

            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)

        })
        app.get("/brand/:brandName", async (req, res) => {

            console.log("get id: ", req.params.brandName)
            const getBrandProducts = req.params.brandName;

            const query = { brand: getBrandProducts }

            const result = await brandProductsCollection.find(query).toArray();
            res.send(result);
        })
        app.get("/productDetails/:productId", async (req, res) => {

        
            const getProductDetails = req.params.productId;

            const query = {_id: new ObjectId(getProductDetails) }

            const result = await brandProductsCollection.find(query).toArray();
            res.send(result);
        })
       
        






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Coffee management server is running");
})


app.listen(port, () => {

    console.log(`server is running on port ${port}`)
})