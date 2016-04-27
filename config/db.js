'use strict';

var mysql = require('mysql');

// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'secret'
// });

var db = mysql.createConnection(process.env.JAWSDB_URL);

db.connect();

// db.query('CREATE DATABASE IF NOT EXISTS inventory', function(err) {
//     if (err) throw err;
//
//     db.query('USE inventory', function(err) {
//         if (err) throw err;

        db.query('CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT)', function(err) {
            if (err) throw err;

            db.query('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT)', function(err) {
                if (err) throw err;

                db.query('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTO_INCREMENT, description TEXT, category INTEGER, value DECIMAL, room INTEGER)', function(err) {
                    if (err) throw err;
                });
            });
        });
//     });
// });

module.exports = db;