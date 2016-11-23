'use strict';
require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {logging: true});

var user = require('../lib/users');
var group = require('../lib/groups');
var event = require('../lib/events');

var User = user.User(sequelize, Sequelize);
var Group = group.Group(sequelize, Sequelize);
var GroupMember = group.GroupMember(sequelize, Sequelize);
var Event = event.Event(sequelize, Sequelize);
var EventMember = event.EventMember(sequelize, Sequelize);


//--- Initializes important database model associations ---//
function init() {
    User.getFriends = function(userid, cb, err){
        var id = 1;
        sequelize.query('SELECT * ' +
            'FROM members ' +
            'WHERE id IN ( ' +
            '   SELECT "memberId" '+
            '   FROM "groupMembers" '+
            '   WHERE "groupId" IN( '+
            '      SELECT "groupId" ' +
            '      FROM "groupMembers" '+
            '      WHERE "memberId" = ?' +
            '   )' +
            '   EXCEPT' +
            '   SELECT ?'+
            ')', {
            model: User,
            replacements: [userid, userid],
            type: sequelize.QueryTypes.SELECT
        })
            .then(cb, err);
    };


    Group.belongsToMany(User, {
        through: GroupMember,
        as:'member',
        foreignKey: 'groupId'
    });

    User.belongsToMany(Group, {
        through: GroupMember,
        as: 'group',
        foreignKey:'memberId'
    });

    Group.hasMany(Event, {
        foreignKey: 'groupId'
    });

    Event.belongsToMany(User, {
        through: EventMember,
        as:'member',
        foreignKey: 'eventId'
    });
    User.belongsToMany(Event, {
        through: EventMember,
        as: 'event',
        foreignKey: 'memberId'
    });

    sequelize.sync();
    User.getFriends(1, function(members){
        console.log(members);
    });
}



function fx(userid, cb, err){
    var id = 1;
    sequelize.query('SELECT * ' +
        'FROM members ' +
        'WHERE id IN ( ' +
        '   SELECT "memberId" '+
        '   FROM "groupMembers" '+
        '   WHERE "groupId" IN( '+
        '      SELECT "groupId" ' +
        '      FROM "groupMembers" '+
        '      WHERE "memberId" = ?' +
        '   )' +
        '   EXCEPT' +
        '   SELECT ?'+
        ')', {
        model: User,
        replacements: [userid, userid],
        type: sequelize.QueryTypes.SELECT
    })
        .then(cb, err);
}


module.exports = {
    User: User,
    Group: Group,
    Event: Event,
    init:init
};