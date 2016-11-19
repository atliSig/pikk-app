require('dotenv').config();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

var user = require('../lib/users');
var group = require('../lib/groups');

var User = user(sequelize, Sequelize);
var Group = group(sequelize, Sequelize);


// Group.hasMany(User, {through: 'user_in_group'});
// User.hasMany(Group, {through:'user_in_group'});

module.exports = {
    User: User,
    Group: Group
};

// UserProjects = sequelize.define('user_in_group', {
//     admin: DataTypes.BOOLEAN
// })