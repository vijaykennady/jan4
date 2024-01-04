const express=require('express');
const bodyParser=require('body-parser');
const db=require('mongoose');

const app=express();

app.use(bodyParser.json());

db.connect("mongodb://localhost:27017/practice_db",{family:4});
db.connection.on("error",console.error.bind(console,"error"));
db.connection.once("open",()=>{
    console.log("MongoDB connected Successfully");
});

const House=db.model("home",new db.Schema({
    name:String,
    color:String,
    amount:Number
}));

app.post("/post",async(req,res)=>{
    await new House(req.body).save();
    res.send("Success");
});

app.get("/getById/:id",async(req,res)=>{
    const id=req.params.id;
    const gets=await House.findById(id);
    res.send(gets);
});

app.put("/update/:id",async(req,res)=>{
    const id=req.params.id;
    await House.updateOne({_id:id},req.body);
    res.send("Updated");
});

app.delete("/deleteById/:id",async(req,res)=>{
    const id=req.params.id;
    await House.deleteOne({_id:id},req.body);
    res.send("Deleted");
});
app.listen(3000);