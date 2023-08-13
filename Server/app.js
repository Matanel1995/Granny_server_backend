const { query, json } = require('express');
const express = require('express')
const app = express()
const port = 8080

const userRoute = require('./routes/UserRoute');
const groupRoute = require('./routes/groupRoute');


app.use('/user', userRoute);
app.use('/group',  groupRoute);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
