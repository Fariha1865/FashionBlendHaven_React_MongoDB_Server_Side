const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

//middleware


app.use(express.json());

const corsOptions={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));

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
        let cartProductsCollection;

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

            const query = { _id: new ObjectId(getProductDetails) }

            const result = await brandProductsCollection.find(query).toArray();
            res.send(result);
        })
        app.get("/updateProducts/:id", async (req, res) => {


            console.log(req.params.id)
            const getProductDetails = req.params.id;

            const query = { _id: new ObjectId(getProductDetails) }

            const result = await brandProductsCollection.find(query).toArray();
            res.send(result);
        })


        app.post("/brandProducts", async (req, res) => {

            console.log('Inside post hitting')
            // console.log(req.body);


            const product = req.body;
            const result = await brandProductsCollection.insertOne(product);
            res.send(result);

            console.log(result);

        })
        app.post("/cartProducts/:userEmail", async (req, res) => {

            // console.log(req.params.userEmail)
            
          
            try {
                cartProductsCollection = database.collection(`cartProducts${req.params.userEmail}`);



                const product = req.body;
                const result = await cartProductsCollection.insertOne(product);
                res.send(result);
            } catch (error) {
                res.status(500).json({ errorCode: error.code, errorMessage: error.message });
            }



        })
        app.get("/cart/:userEmail", async (req, res) => {

            const cartProductsCollection = database.collection(`cartProducts${req.params.userEmail}`);


            const query = { email: req.params.userEmail }

            const result = await cartProductsCollection.find(query).toArray();
            console.log(result)
            res.send(result)

        })

        app.put("/productUpdate/:id", async (req, res) => {

            const updatedProductId = req.params.id;
            const updated = req.body;

            console.log("user to update", updatedProductId)
            console.log("user to update", updated)

            const filter = { _id: new ObjectId(updatedProductId) }

            const options = { upsert: true };

            const updateProduct = {
                $set: {
                    name: updated.name,
                    brand: updated.brand,
                    photo: updated.photo,
                    price: updated.price,
                    type: updated.type,
                    rating: updated.rating,
                    description: updated.description,
                },
            };

            const result = await brandProductsCollection.updateOne(filter, updateProduct, options);

            res.send(result);
        })

        app.delete("/product/:id", async (req, res) => {
        
           
                const deleteProduct = req.params.id;
                const query = { _id: deleteProduct };
        
                const result = await cartProductsCollection.deleteOne(query);
                res.send(result)
        
                
            
        });
        








        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Brand Shop server is running");
})


app.listen(port, () => {

    console.log(`server is running on port ${port}`)
})