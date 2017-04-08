'use strict';
require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false});

var user = require('../models/users');
var group = require('../models/groups');
var event = require('../models/events');
var notification = require('../models/notifications');
var restaurant = require('../models/restaurant');

var User = user.User(sequelize, Sequelize);
var Group = group.Group(sequelize, Sequelize);
var GroupMember = group.GroupMember(sequelize, Sequelize);
var Event = event.Event(sequelize, Sequelize);
var EventMember = event.EventMember(sequelize, Sequelize);
var Notification = notification.Notification(sequelize, Sequelize);
var Restaurant = restaurant.Restaurant(sequelize, Sequelize);


//--- Initializes important database model associations ---//
function init() {
    //initialize database with associations and functions

    User.getFriends = getFriends;
    EventMember.getDecidedMembers = getDecidedMembers;
    EventMember.getUnDecidedMembers = getUnDecidedMembers;
    User.getGroupsAndFriends = getGroupsAndFriends;

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

    Event.hasOne(Restaurant);

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

//get members of an event that have decided
function getDecidedMembers(eventid, cb, err){
    sequelize.query('' +
        'SELECT members.*, "eventMembers"."selectedPlace" from members, "eventMembers"'
        +'where members.id = "eventMembers"."memberId"'
        +'and "eventMembers"."eventId" = ?'
        +'and "eventMembers"."selectedPlace" is not null', {
        replacements: [eventid],
        type: sequelize.QueryTypes.SELECT
    }).then(cb,err);
}

//get members of an event that have not decided
function getUnDecidedMembers(eventid, cb, err){
    sequelize.query(
        'SELECT members.*, "eventMembers"."selectedPlace" from members, "eventMembers"'
    +'where members.id = "eventMembers"."memberId"'
    +'and "eventMembers"."eventId" = ?'
    +'and "eventMembers"."selectedPlace" is null', {
        replacements: [eventid],
        type: sequelize.QueryTypes.SELECT
    }).then(cb,err);
}

function getGroupsAndFriends(userid, cb, err) {
    sequelize.query(
    'SELECT "members"."first_name" AS "adminName", "groupMembers"."isAdmin", ' +
    '   "groups"."id", "groups"."name", "groups"."description", "groups"."createdAt", "groups"."updatedAt" ' +
    'FROM "groupMembers" '+
    'INNER JOIN "groups" '+
    '   ON "groupMembers"."groupId" = "groups"."id" '+
    'INNER JOIN "members" '+
    '   ON "groupMembers"."memberId" = "members"."id" '+
    'WHERE "groupId" IN '+
    '    (SELECT "groupId" FROM "groupMembers" '+
    '     INNER JOIN "members" '+
    '     ON "groupMembers"."memberId" = "members"."id" '+
    '     where json_extract_path_text("members".google,\'id\')= ?) ' +
    'AND "groupMembers"."isAdmin"=\'TRUE\' '+
    'order by members.first_name', {
        replacements :[userid],
            type: sequelize.QueryTypes.SELECT
    }).then(cb, err);
}

module.exports = {
    User: User,
    Group: Group,
    Event: Event,
    Notification: Notification,
    Restaurant: Restaurant,
    EventMember: EventMember,
    init:init
};