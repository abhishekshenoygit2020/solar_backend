require("dotenv").config(); //configuring database
var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
// var nodemailer = require('nodemailer');
var app = express();
const jwt = require('jsonwebtoken');
const baseRoute = require("./api/Routes");
const { response } = require("express");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(baseRoute);




app.listen(process.env.APP_PORT,()=>{
    console.log("server is running......" ,process.env.APP_PORT);
});

//abhishek code chnaged from abi local machine
//varsha code chnaged from varsha local machine
//abhishek code chnaged after taking a pull from varsha repo