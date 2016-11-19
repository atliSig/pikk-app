require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false});

var user = require('../lib/users');
var group = require('../lib/groups');

var User = user.User(sequelize, Sequelize);
var Group = group.Group(sequelize, Sequelize);


Group.belongsToMany(User, {through: 'user_in_group'});
User.belongsToMany(Group, {through:'user_in_group'});



sequelize.sync();
module.exports = {
    User: User,
    Group: Group
};