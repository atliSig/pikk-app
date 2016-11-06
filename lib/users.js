'use strict';
var pg = require('pg');

const DATABASE = process.env.DATABASE_URL;

module.exports.createuser = function createUser(username, firstname, lastname, cb) {
    pg.connect(DATABASE, function (error, client, done) {
        if (error) {
            return cb(error);
        }

        var values = [username, new Date(), firstname, lastname];
        // var values = [1]
        var query;
        query = 'INSERT into main.pikk_user(username, date_created, first_name, last_name) VALUES($1, $2, $3, $4)';

        client.query(query, values, function (err, result) {
            done();
            if (err) {
                console.error(err);
                return cb(error);
            }
            else {
                return cb(null, true);
            }
        });
    });
};

module.exports.finduser = function findUser(username, cb) {
    pg.connect(DATABASE, function (error, client, done) {
        if (error) {
            return cb(error);
        }

        var values = [username];
        var query = "SELECT username, first_name, last_name, phone, email, nikk FROM main.pikk_user WHERE username=$1;";
        console.log(query);
        client.query(query, values, function (err, result) {
            done();
            if (err) {
                return cb(err);
            } else {
                return cb(null, result.rows);
            }
        });
    });
};

