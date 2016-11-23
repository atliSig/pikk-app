'use strict';

var Notification = function(sequelize, DataTypes){
    var notification = sequelize.define('event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        content: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING(64),
            allowNull: true,
            defaultValue: ""
        }
    });
    return notification;
};

module.exports.Notification = Notification;
