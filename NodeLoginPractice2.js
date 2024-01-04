const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const port = 3000;

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "login_bcrypt",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Error while connecting DB");
    }
    else {
        console.log("DB connected Successfully");
    }
});

app.post("/post", async (req, res) => {
    const hasPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hasPassword };
    db.query("insert into login2 (username,password) values(?,?)", [user.username, user.password], (err, result) => {
        if (err) {
            console.error("Error while posting", err.stack);
            res.status(500).send("Error while posting");
        }
        else {
            console.log("Success");
            res.status(200).send("Success");
        }
    });
});

app.post("/login", (req, res) => {
    db.query("select * from login2",async (err, result) => {
        if (err) {
            console.error("Error while GetAll");
        }
        else {
            const allDetails = result;

            user1 = allDetails.find(a => a.username === req.body.username);

            if (!user1) {
                res.status(401).send("Username not found");
            }
            else {
                const pass=await bcrypt.compare(req.body.password,user1.password);
                if(pass) {
                    res.status(200).send("Login Success");
                }
                else {
                    res.status(401).send("Incorrect password");
                }
            }
        }
    });
});

app.listen(port, () => {
    console.log(`This application running in ${port}`);
});