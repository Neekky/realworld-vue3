const express = require("express");
const app = express()
const port = 9010

app.use(express.static('./dist'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})