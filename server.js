const express = require('express');

const app = express();

// menangkap data dari form user
app.use(express.json());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Express Running");
});

app.listen(port, () => {
    console.log(`Server started on port : ${port}`);
});