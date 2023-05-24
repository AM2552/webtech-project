const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

app.get('/post_name', async (req, res) => {
    let {name} = req.body
    console.log(name)
})

app.post()

app.listen(5000)

console.log("Server now listening on http://localhost:5000/")