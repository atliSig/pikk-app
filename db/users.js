/**
 * Created by atli on 8.11.2016.
 */
var pg = require('pg');
const DATABASE = process.env.DATABASE_URL;

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
    , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};


//Having trouble making this work
exports.findByDB = function(username, cb) {
    pg.connect(DATABASE, function (error, client, done) {
        if (error) {
            return cb(error);
        }
        var values = [username];
        var query = "SELECT username, first_name, last_name, phone, email, nikk FROM main.pikk_user WHERE username=$1;";
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