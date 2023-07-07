const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
    extended: true //ALLOWS US TO POST NESTED OBJECTS
}));
app.use(express.static("public"))
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");