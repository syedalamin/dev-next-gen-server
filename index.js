const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//* middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pts32jw.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    //! collection 
    const bannerCollection = client.db("DevNextGen").collection("welcomeBanner");
    const joinCompanyCollection = client.db("DevNextGen").collection("joinCompany");
    const teamVideoCollection = client.db("DevNextGen").collection("teamVideo");
    const workServiceSupportCollection = client.db("DevNextGen").collection("workServiceSupport");
    const clientReviewCollection = client.db("DevNextGen").collection("clientReview");

    //! welcome banner
    app.get('/banner', async(req, res)=>{
      const result = await bannerCollection.find().toArray();
      res.send(result)
    });

    app.put('/banner/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateBanner = req.body;
      const banners = {
        $set: {
          heading: updateBanner.heading,
          image: updateBanner.image,
          title: updateBanner.title,
          subtitle: updateBanner.subtitle
        }
      }
      const result = await bannerCollection.updateOne(filter, banners, options);
      res.send(result);
    });


    //! join 10 company
    app.get('/company', async(req, res)=>{
      const result = await joinCompanyCollection.find().toArray();
      res.send(result)
    });

    app.post('/company', async(req, res)=>{
      const company = req.body;
      const result = await joinCompanyCollection.insertOne(company);
      res.send(result)

    });

    app.delete('/company/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await joinCompanyCollection.deleteOne(query);
      res.send(result)
    });

    //! team video
    app.get('/teamvideo', async(req, res)=>{
      const result = await teamVideoCollection.find().toArray();
      res.send(result)
    });

    app.put('/teamvideo/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateTeamVideo = req.body;
      const teamVideo = {
        $set: {
          video: updateTeamVideo.video,
          image: updateTeamVideo.image,
        }
      }
      const result = await teamVideoCollection.updateOne(filter, teamVideo, options);
      res.send(result);
    });

    //! workServiceSupport
    app.get('/workservicesupport', async(req, res)=>{
      const result = await workServiceSupportCollection.find().toArray();
      res.send(result);
    });

    app.post('/workservicesupport', async(req, res)=>{
      const work = req.body;
      const result = await workServiceSupportCollection.insertOne(work);
      res.send(result);
    });

    app.delete('/workservicesupport/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await workServiceSupportCollection.deleteOne(query);
      res.send(result)
    });

    //! clientReview
    app.get('/clientreview', async(req, res)=>{
      const result = await clientReviewCollection.find().toArray();
      res.send(result)
    });

    app.post('/clientreview', async(req, res)=>{
      const review = req.body;
      const result = await clientReviewCollection.insertOne(review);
      res.send(result)
    });

    app.delete('/clientreview/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await clientReviewCollection.deleteOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('Dev Next Gen');
});

app.listen(port, ()=>{
    console.log(`Dev Next Gen Is Running Port On : ${port}`);
})