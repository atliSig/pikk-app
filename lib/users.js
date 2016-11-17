'use strict';
const DATABASE = process.env.DATABASE_URL;
var pg = require('pg');
var Sequelize = require('sequelize');
var pool = {max: 30, min: 0, idle: 10000}
var sequelize = new Sequelize(DATABASE);
var sequelize = new Sequelize("postgres://peturhelgi:admin@localhost/pikkdb");

var User = sequelize.define('pikk_user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
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

    google: {
        type:Sequelize.JSON
    }
});



module.exports.create = function(user) {
    User.Create(user);
};


module.exports.findOne = function findOne(social_id, cb){
    console.log('gothere');
    User.findOne({where: social_id}).then(cb);
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

