const { query, json } = require('express');
const express = require('express')
const app = express()
const port = 8080

const userRoute = require('./routes/UserRoute');
app.use('/user', userRoute);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
