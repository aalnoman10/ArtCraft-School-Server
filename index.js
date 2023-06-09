const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000
const app = express()

// middelware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server run')
})


app.listen(port, () => {
    console.log(`listen ${port}`);
})