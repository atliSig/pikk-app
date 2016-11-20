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
    return sequelize.define('groupMembers', {
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};

module.exports = {
    Group: Group,
    GroupMembers: GroupMember
}