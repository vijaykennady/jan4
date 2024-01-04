const express=require('express');
const mysql=require('mysql2');
const bodyParser=require('body-parser');
const port=3000;

const app=express();
app.use(bodyParser.json());

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "http://localhost:4200"); 
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); next();
     });

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"node_all",
    port:3306
});

db.connect((err)=>{
    if(err) {
        console.error("Error while connecting DB");
    }
    else {
        console.log("DB connected successfully");
    }
});

app.post("/post",(req,res)=>{
    const {name,age,section}=req.body;
    db.query("insert into school (name,age,section) values (?,?,?)",[name,age,section],(err,result)=>{
        if(err) {
            console.error("Error while posting Data",err.stack);
            res.status(500).send("Error while posting Data");
        }
        else {
            console.log("Details has been posted successfully");
            res.status(200).send("Details has been posted successfully");
        }
    }); 
});

app.get("/getById/:id",(req,res)=>{
    const id=req.params.id;
    db.query("select * from school where id=?",[id],(err,result)=>{
        if(err) {
            console.error("Error while getting your data",err.stack);
            res.status(500).send("Error while getting your data");
        }
        else{
            console.log("This is your details");
            res.status(200).send(result);
        }
    });
});

app.get("/getAll",(req,res)=>{
    db.query("select * from school",(err,result)=>{
        if(err) {
            console.error("Error while gettingAll",err.stack);
            res.status(500).send("Error while gettingAll");
        }
        else {
            console.log("This is your Details");
            res.status(200).send(result);
        }
    });
});

app.put("/update/:id",(req,res)=>{
    const id=req.params.id;
    const {name,age,section}=req.body;
    db.query("update school set name=?,age=?,section=? where id=?",[name,age,section,id],(err,result)=>{
        if(err) {
            console.error("Error while updating your data");
            res.status(500).send("Error while updating your data");
        }
        else {
            console.log("Your data has been updated");
            res.status(200).send("Your data has been updated");
        }
    });
});

app.delete("/deleteById/:id",(req,res)=>{
    const id=req.params.id;
    db.query("delete from school where id=?",[id],(err,result)=>{
        if(err) {
            console.error("Error while deleting your data");
            res.status(500).send("Error while deleting your data");
        }
        else {
            console.log("Your details has been deleted");
            res.status(200).send("Your details has been deleted");
        }
    });
});



app.listen(port,()=>{
    console.log(`This application running on ${port}`);
});