'use strict';
require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {logging: true});

var user = require('../models/users');
var group = require('../models/groups');
var event = require('../models/events');
var notification = require('../models/notifications');

var User = user.User(sequelize, Sequelize);
var Group = group.Group(sequelize, Sequelize);
var GroupMember = group.GroupMember(sequelize, Sequelize);
var Event = event.Event(sequelize, Sequelize);
var EventMember = event.EventMember(sequelize, Sequelize);
var Notification = notification.Notification(sequelize, Sequelize);


//--- Initializes important database model associations ---//
function init() {
    User.getFriends = getFriends;

    User.hasMany(Notification, {
       foreignKey: 'memberId'
    });

    Notification.belongsTo(User);

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
    // User.getFriends(1, function(members){
    //     console.log(members);
    // });
}

//Gets friends of a user through groups.
function getFriends(userid, cb, err){
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
    Notification: Notification,
    init:init
};