const express=require('express');
const mysql=require('mysql2');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const port=3000;

const app=express();

app.use(bodyParser.json());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"login_bcrypt",
    port:3306
});

db.connect((err)=>{
    if(err) {
        console.error("Error while connecting DB");
    }
    else {
        console.log("DB connect successfully");
    }
});
app.post("/post",async(req,res)=>{
    const hasPassword=await bcrypt.hash(req.body.password,10);
    const users={username:req.body.username,password:hasPassword};
    db.query("insert into login (username,password) values (?,?)",[users.username,users.password],(err,result)=>{
        if(err) {
            console.error("Error while posting data",err.stack);
            res.status(500).send("Error while posting data");
        }
        else {
            console.log("Details has been posted successfully");
            res.status(200).send("Details has been posted successfully");
        }
    });
});

app.post("/login",(req,res)=>{

    
    db.query("select * from login", async (err,result)=>{
        if(err) {
            console.error("Error while getting data");
        }
        const userData= result;

        const data= userData.find(users => users.username === req.body.username);
    if(!data) {
        res.status(401).send("Username not found");
    }
    else {
        const pass = await bcrypt.compare(req.body.password,data.password);
        if(pass) {
            res.status(200).send("Login successfully");
        }
        else {
            res.status(400).send("Incorrect passwordd");
        }
    }
    });

});
app.listen(port,()=>{
    console.log(`This application is running on ${port}`);
});