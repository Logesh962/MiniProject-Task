const express = require("express");
const app = express();
app.use("/",express.static('public'))
const cors = require("cors")
app.use(cors())

app.listen(3000,()=>{
    console.log("Front-end port listening on port 3000.....")
})