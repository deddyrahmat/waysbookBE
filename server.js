const express = require('express');
const routes = require('./src/routes/index');

const app = express();

app.use(cors());

require('dotenv').config()

// menangkap data dari form user
app.use(express.json());

const port = process.env.PORT || 5000;

// membuat static url untuk menampilkan file
app.use("/api/v1/uploads", express.static("uploads"));

app.use("/api/v1",routes);

app.get('/', (req, res) => {
    res.send("Express Running");
});

app.listen(port, () => {
    console.log(`Server started on port : ${port}`);
});