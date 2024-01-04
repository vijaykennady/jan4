const express = require('express');
const bodyParser = require('body-parser');
const db = require('mongoose');

const app = express();
app.use(bodyParser.json());

db.connect("mongodb://localhost:27017/lap_db", { family: 4 });
db.connection.on("error", console.error.bind(console, "error"));
db.connection.once("open", () => {
    console.log("MongoDB connected successfully");
});

const Lap = db.model("lap", new db.Schema({
    brand: String,
    color: String,
    price: Number
}));

app.post("/post", async (req, res) => {
    await new Lap(req.body).save();
    res.send("Success");
});

app.get("/getById/:id", async (req, res) => {
    const id = req.params.id;
    const gets = await Lap.findById(id);
    res.send(gets);
});

app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    await Lap.updateOne({ _id: id }, req.body);
    res.send("Updated");
});

app.delete("/deleteById/:id", async (req, res) => {
    const id = req.params.id;
    await Lap.deleteOne({ _id: id }, req.body);
    res.send("Deleted");
});
app.listen(3000);