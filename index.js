const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express();

app.use(cors()); 
app.use(express.json());  

app.get("/", (req, res) => {
  res.status(200).json({});
});

const rutaslibros = require("./routes/books");
app.use("/books", rutaslibros);

 

mongoose.connect(
    "mongodb+srv://jhimi321123:nsS0WaQxcX8LnJiq@cluster0.t6xactb.mongodb.net"
);

app.listen(8080);