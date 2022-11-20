const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function home(req, res) {
    // a GET request to home page
    if (req.query.name) {
        res.json(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.json(`Hello! Welcome to the FIFA server!`)
    }
}

// ********************************************
//            MORE ROUTES HERE
// ********************************************

module.exports = {
    home
}