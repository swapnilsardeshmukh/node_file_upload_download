var port = 9001;
const express = require("express");
const app = express();
const config = require('./config');
// const mysql = require('mysql') ; //For Mysql
const {Pool} = require("pg");

const mainRoutes = require('./api/routes/mainRoutes');
const mongoose = require("mongoose");

global.__basedir = __dirname;
// const db = mysql.createPool(config.db); //Mysql
const db = new Pool(config.db);

app.use(function(req, res, next) {
    setRquestValues(req, res);
        next();
});

db.connect(err => err ? console.log(err) : console.log('Connected to database Pg'));

function setRquestValues(req, res) {
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //res.header('server', "mobeserv");
    req.db = db;
}

/*
mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'event_db',
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, err => err ? console.log(err) : console.log('Connected to database'));
*/

app.use('/api', mainRoutes);

if (port == null || port == "") {
    port = 3000;
  }
  
  app.listen(port, function() {
    console.log("Server started on Port : " , port );
  });