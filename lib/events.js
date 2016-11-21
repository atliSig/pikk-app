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
            type: DataTypes.DATE,
            allowNull:false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true
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
            allowNull: false
        },
        answer1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answer2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answer3: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answer4: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    return eventMember
};

module.exports = {
    Event: Event,
    EventMember: EventMember
}