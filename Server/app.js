// const { query, json } = require('express');
const express = require('express')
const app = express()
const port = 8080

const userRoute = require('./routes/UserRoute');
app.use('/user', userRoute);

const groupRoutes = require('./routes/groupRoute');
app.use('/group', groupRoutes);


app.get('', async (req, res) => {
  console.log("test");
  res.send("working");
  return "working";
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
