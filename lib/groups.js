'use strict';
var pg = require('pg');

const DATABASE = process.env.DATABASE_URL;


module.exports.getGroups = function get_groups(username, cb) {
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

module.exports.createGroup = function createGroup(admin, members, groupName, description, cb){
    pg.connect(DATABASE, function (error, client, done) {
        if(error){
            return cb(error);
        }

        var values = [admin.userid]
        members.forEach(function(member){
            values.push(member.userid);
        });
        var query = "INSERT INTO main.groups(name, description) VALUES ($1, $2);"
    });

};

