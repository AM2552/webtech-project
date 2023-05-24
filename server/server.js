const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/post_name', async (req, res) => {
    let { name } = req.body
    console.log(name)
})

app.listen(4000)

console.log("Server now listening on http://localhost:4000/")