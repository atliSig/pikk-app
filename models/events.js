'use strict';

var Event = function(sequelize, DataTypes){
    var event = sequelize.define('event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        satisfaction: {
            type: DataTypes.REAL,
            unique: false,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING(70),
            allowNull: true,
            defaultValue: ""
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            defaultValue: ""
        },
        toe: {
            type: DataTypes.TIME,
            allowNull:false
        },
        deadline: {
            type: DataTypes.TIME,
            allowNull: true
        },
        isReady:{
            type:DataTypes.BOOLEAN,
            default: false
        }
    });
    return event;
};
var EventMember = function(sequelize, DataTypes){
    var eventMember = sequelize.define('eventMember', {
        satisfaction: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        answer0: {
            type: DataTypes.STRING,
            allowNull: true
        },
        answer1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        answer2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        answer3: {
            type: DataTypes.STRING,
            allowNull: true
        },
        answer4: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    });

    return eventMember
};

module.exports = {
    Event: Event,
    EventMember: EventMember
}