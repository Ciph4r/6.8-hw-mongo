const express = require('express');
const app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = 'mongodb://localhost/firstdb';
// const client = new MongoClient(uri, {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// });


const arr = [
    {
    name: 'NextGen Advisors',
    industry: 'Professional Services',
    contact: 'John Rutton',
    city: 'Newark',
    state: 'NJ',
    sales: 535000,
    },
    {
    name: 'Receivers Inc',
    industry: 'Legal',
    contact: 'Stacey Martin',
    city: 'New York',
    state: 'NY',
    sales: 201000,
    },
    {
    name: 'Ethan Allen',
    industry: 'Textile',
    contact: 'Mark Shamburger',
    city: 'Seacaucus',
    state: 'NJ',
    sales: 735000,
    },
    {
    name: 'Russian River',
    industry: 'Transportation',
    contact: 'Phil Butterworth',
    city: 'Parsipanny',
    state: 'NJ',
    sales: 205000,
    },
    {
    name: 'Johnson',
    industry: 'Legal',
    contact: 'Beverly Stephens',
    city: 'Syracuse',
    state: 'NY',
    sales: 135000,
    },
    {
    name: 'Kravet',
    industry: 'Textile',
    contact: 'Jan Farnsworth',
    city: 'Ithaca',
    state: 'NY',
    sales: 105000,
    },
    {
    name: 'Wacomb',
    industry: 'Professional Services',
    contact: 'Larry Peters',
    city: 'Elizabeth',
    state: 'NJ',
    sales: 130000,
    },
    {
    name: 'Farnsworth',
    industry: 'Transportation',
    contact: 'Peter Dalton',
    city: 'Philadelphia',
    state: 'PA',
    sales: 437000,
    },
    {
    name: 'Barnes',
    industry: 'Legal',
    contact: 'John Percy',
    city: 'White Plains',
    state: 'NY',
    sales: 350000,
    },
    ]













MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((client) => {
    const db = client.db('firstdb');
    const placesCollection = db.collection('places')



    let places
    let sum = 0

    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));
    // \*\*\*EVERYTHING EXCEPT app.listen.... GOES IN HERE
    app.get('/', (req, res) => {
        placesCollection.find().toArray().then(x => {places = x})
        .catch(err => console.log(err))
        return res.status(200).json({ confirmation: 'success' ,places})
    })

    app.get('/remove', (req, res) => {
        placesCollection.deleteMany ( { } )
        placesCollection.find().toArray().then(x => {places = x})
        .catch(err => console.log(err))
        return res.status(200).json({ confirmation: 'success' ,places})
    })

    app.get('/create', (req, res) => {
        placesCollection.insertMany(arr, function(err, res) {
            if (err) throw err;
            console.log("document inserted");
            placesCollection.find().toArray().then(x => {places = x})
            .catch(err => console.log(err))
            
          });
          return res.status(200).json({ confirmation: 'success' ,places})
    })

    app.get('/count', (req, res) => {
        placesCollection.find().toArray().then(x => {places = x.length})
        .catch(err => console.log(err))
        return res.status(200).json({ confirmation: 'success' ,places})
    })
    app.get('/insertone', (req, res) => {
        const newPlaces =  { 
            name: req.body.name , 
            industry: req.body.industry,
            contact: req.body.contact, 
            city: req.body.city,
            state: req.body.state,
            sales: req.body.sales
        } 
        placesCollection.insertOne( newPlaces )
        return res.status(200).json({ confirmation: 'success' ,newPlaces})
    })
    app.get('/delete', (req, res) => {
        placesCollection.deleteOne ( {name: req.body.name} )
        return res.status(200).json({ confirmation: 'success'})
    })
    app.get('/lessthan/:value', (req, res) => {
        
        const check = {sales: { $lt: Number(req.params.value)}}
        placesCollection.find(check).toArray().then(x => {places = x})
        .catch(err => console.log(err))
        return res.status(200).json({ confirmation: 'success' , places })
    })
    app.get('/sum/:value', (req, res) => {
        const check = {industry: req.params.value}
        placesCollection.find(check).toArray().then(x => {sum = x.reduce((a,b) => a + b.sales ,0)})
        .catch(err => console.log(err))
        return res.status(200).json({ confirmation: 'success' , sum })
    })
    app.get('/between/:value/:value2', (req, res) => {
        const check = {$and: [{ sales: {$gt:Number(req.params.value)}} , { sales: {$lt:Number(req.params.value2)}} ]}
        placesCollection.find(check).toArray().then(x => {places = x.sort((a, b) => a.sales - b.sales)})
        .catch(err => console.log(err))
        return res.status(200).json({ confirmation: 'success' , places })
    })
});

    




app.listen(3000, () => {
    console.log('3000');
});