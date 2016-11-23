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
     fx();
}

function fx(){
    Event.create({
        phone_id: '1493514',
        deadline: '2004-10-19 10:23:54+02',
        toe: '2004-10-19 10:23:54+02',
        title: 'Celebration sleep'
    })
        .then(function(event){
            User.findOne({
                where: {id:7}
            })
                .then(function(user){
                    event.addMember(user, {isAdmin: false});
                });
        });
}


module.exports = {
    User: User,
    Group: Group,
    Event: Event,
    init:init
};