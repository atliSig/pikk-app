'use strict';

var Group = function(sequelize, DataTypes){
    var group = sequelize.define('group', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name: {
            type: DataTypes.STRING(75),
            unique: false,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            defaultValue: ""
        }
    });
    return group;
};
var GroupMember = function(sequelize, DataTypes){
    return sequelize.define('groupMember', {
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: "false"
        }
    });
};

module.exports = {
    Group: Group,
    GroupMember: GroupMember
}