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
        console.error("Error while connecting DB", err.stack);
    }
    else {
        console.log("DB connected successfully");
    }
});

app.post("/update", async (req, res) => {
    const hasPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hasPassword };

    db.query("insert into login1 (username,password) values (?,?)", [user.username, user.password], (err, result) => {
        if (err) {
            console.error("Error while inserting data", err.stack);
            res.status(500).send("Error while inserting data");
        }
        else {
            console.log("Success");
            res.status(200).send("Success");
        }
    });
});

app.post("/login", (req, res) => {
    db.query("select * from login1", async (err, result) => {
        if (err) {
            console.error("Error while getting");
        }
        else {
            const allData = result;

            const data = allData.find(a => a.username === req.body.username);
            if (!data) {
                res.status(401).send("Username not found");
            }
            else {
                const pass = await bcrypt.compare(req.body.password, data.password);
                if (pass) {
                    res.status(200).send("Login Success");
                }
                else {
                    res.status(500).send("Password incorrect");
                }
            }
        }
    });
});
app.listen(port, () => {
    console.log(`This application running on ${port}`)
});