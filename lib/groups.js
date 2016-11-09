'use strict';
var pg = require('pg');

const DATABASE = process.env.DATABASE_URL;


module.exports.get_groups = function get_groups(username, cb) {
    pg.connect(DATABASE, function (error, client, done) {
        if (error) {
            return cb(error);
        }

        var values = [username];
        var query =
            "SELECT main.group.id, main.group.name, main.group.headquarters " +
            "FROM main.group WHERE main.group.id IN (" +
            "   SELECT group_id" +
            "   FROM main.user_in_group" +
            "   WHERE user_id= $1 );";
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

