const express= require('express');
const app=express();
const MongoClient = require("mongodb").MongoClient;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const client = new MongoClient("", {
  useUnifiedTopology: true,
});

let collection;
const testing = async() =>{
    try{
        await client.connect();
        console.log("Connected!");
        collection = client.db().collection("task");
     }
    catch(err){
        console.error(err);
        process.exit(-1);
    }
}


app.get('/', async(req, res) => {
    let a= await collection.find({}).toArray();;
    res.json(a);
});


app.post('/', async(req,res) => {
    let b=req.body;
    await collection.insertOne(b);
    res.send("Data stored!");
});


app.put('/', async(req,res)=>{
    let body=req.body;
    let input=body.name;
    let update= await collection.findOne({name: input});
    update.address=body.address;
    await collection.replaceOne({name: input}, update);
    res.send("Data Updated and stored");
});


app.delete('/', async(req,res)=>{
    let deleting=req.body;
    await collection.deleteOne({name: deleting.name});
    res.send("Data deleted");
});


testing().then(() => {
    app.listen(8888, ()=> {
        console.log("Server is running...");
    })
})