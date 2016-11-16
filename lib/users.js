'use strict';
var pg = require('pg');


const DATABASE = process.env.DATABASE_URL;
var User = sequelize.define('pikk-user', {
    id: {
        type: Sequelize.Integer,
        primaryKey:true,
        autoIncrement:true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(32),
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    first_name:{
        type: Sequelize.STRING
    },
    last_name:{
        type: Sequelize.STRING
    },
    nikk:{
        type: Sequelize.STRING(32),
        unique: true
    },
    date_created:{
        type: Sequelize.Date
    }
});

module.exports.createuser = function createUser(username, firstname, lastname, cb) {
    pg.connect(DATABASE, function (error, client, done) {
        if (error) {
            return cb(error);
        }

        var values = [username, new Date(), firstname, lastname];
        var query;
        query = 'INSERT into main.pikk_user(username, date_created, first_name, last_name) VALUES($1, $2, $3, $4)';

        client.query(query, values, function (err, result) {
            done();
            if (err) {
                return cb(error);
            }
            else {
                return cb(null, true);
            }
        });
    });
};

module.exports.finduser = function findUser(username, cb) {
    // pg.connect(DATABASE, function (error, client, done) {
    //     if (error) {
    //         return cb(error);
    //     }
    //
    //     var values = [username];
    //     var query = "SELECT username, first_name, last_name, phone, email, nikk FROM main.pikk_user WHERE username=$1;";
    //     client.query(query, values, function (err, result) {
    //         done();
    //         if (err) {
    //             return cb(err);
    //         }
    //         else {
    //             return cb(null, result.rows);
    //         }
    //     });
    // });
    User.findOne().then(cb);
};

module.exports.find_user_by_id = function findUserById(id, cb){
    pg.connect(DATABASE, function(error, client, done){
        if(error){
            return cb(err);
        }

        var values = [id];
        var query = "SELECT username, first_name, last_name, phone, email, nikk FROM main.pikk_user WHERE userid = $1;";
        client.query(query, values, function (err,result){
            done();
            if(err){
                return cb(err);
            }
            else{
                return cb(null, result.rows);
            }
        });
    });
};

