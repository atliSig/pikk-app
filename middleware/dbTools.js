require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false});
var user = require('../lib/users');
var group = require('../lib/groups');

var User = user.User(sequelize, Sequelize);
var Group = group.Group(sequelize, Sequelize);
var GroupMember = group.GroupMembers(sequelize, Sequelize);

function init() {
    Group.belongsToMany(User, {
        through:GroupMember,
        as:'member',
        foreignKey: 'groupId'
    });

    User.belongsToMany(Group, {
        through:GroupMember,
        as: 'group',
        foreignKey:'memberId'
    });
    sequelize.sync();
}

function fx(){
    //init();
    User.findAll({
        include:[{model: Group, as: 'group'}]
    }).then(function(users){
        console.log(users);
        });
};

module.exports = {
    User: User,
    Group: Group,
    fx:fx,
    init:init
};