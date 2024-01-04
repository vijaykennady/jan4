const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
app.use(express.json());

const posts = [
    {
        username: "Vijay",
        age: 21
    },
    {
        username: "Kumar",
        age: 29
    }
];

app.post("/post",(req,res)=>{
    const uname=req.body.name;
    const user={names:uname};
    const accessToken=jwt.sign(user,process.env.ACCESS);
    res.json({acToken:accessToken});
});

app.get("/login",authentication,(req,res)=>{
    res.json(posts.filter(a=>a.username===req.user.names));
});

function authentication(req,res,next){
const authHeader=req.headers['authorization'];
const token=authHeader && authHeader.split(' ')[1];

if(token==null) return res.sendStatus(401);
jwt.verify(token,process.env.ACCESS,(err,user)=>{
    if(err) return res.sendStatus(403);
    req.user=user;
    next();
})
};

app.listen(3000);