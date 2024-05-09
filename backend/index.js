// import { DataTypes } from 'sequelize';
const { Sequelize, DataTypes } = require('sequelize');
const express = require("express")
const cors = require("cors")
const {router} = require("./routes/routes")
const {User , Task} = require("./model/User")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use(cors())

app.use(express.json())
console.log("oko");

app.use("/api/v1" , router)

app.listen(PORT, () => {
    console.log("server running on port ",PORT);
})
