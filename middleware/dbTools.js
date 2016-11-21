'use strict';
require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false});

var user = require('../lib/users');
var group = require('../lib/groups');
var event = require('../lib/events');

var User = user.User(sequelize, Sequelize);
var Group = group.Group(sequelize, Sequelize);
var GroupMember = group.GroupMembers(sequelize, Sequelize);
var Event = event.Event(sequelize, Sequelize);
var EventMember = event.EventMember(sequelize, Sequelize);


//--- Initializes important database model associations ---//
function init() {
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
        as:'invitee',
        foreignKey: 'eventId'
    });
    User.belongsToMany(Event, {
        through: EventMember,
        as: 'event',
        foreignKey: 'attendeeId'
    });

    sequelize.sync();
    // fx();
}

function fx(){
    Event.create({
        phone_id: '1493514',
        deadline: Date.now(),
        toe: Date.now(),
        title: 'Celebration sleep'
    }).then(function(event){
            Group.findOne({where:{
                id: 26
            }}).then(function(group){
                group.addEvent(event);
            });
        });
}

module.exports = {
    User: User,
    Group: Group,
    Event: Event,
    init:init
};