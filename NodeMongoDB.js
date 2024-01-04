const express=require('express');
const bodyParser=require('body-parser');
const db=require('mongoose');

const app=express();

app.use(bodyParser.json());

db.connect("mongodb://localhost:27017/office_db",{family:4});
db.connection.on("error",console.error.bind(console,"error"));
db.connection.once("open",()=>{
    console.log("MongoDB has been connected");
});

const Employee=db.model("employee",new db.Schema({
    name:String,
    age:Number,
    role:String
}));

app.post("/post",async(req,res)=>{
    await new Employee(req.body).save();
    res.send("Details has been posted");
});

app.get("/getById/:id",async(req,res)=>{
    const id=req.params.id;
    const gets=await Employee.findById(id);
    res.send(gets);
});

app.put("/update/:id",async(req,res)=>{
    const id=req.params.id;
    await Employee.updateOne({_id:id},req.body);
    res.send("Details has been updated");
});

app.delete("/deleteById/:id",async(req,res)=>{
    const id=req.params.id;
    await Employee.deleteOne({_id:id},req.body);
    res.send("Details has been deleted");
});

app.listen(3000);
