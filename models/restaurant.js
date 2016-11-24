'use strict';

var Restaurant = function(sequelize, DataTypes){
    var restaurant = sequelize.define('restaurant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        phoneId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true
        },
        score0: {
            type: DataTypes.REAL,
            unique: false,
            allowNull: true
        },
        score1: {
            type: DataTypes.REAL,
            unique: false,
            allowNull: true
        },
        score2: {
            type: DataTypes.REAL,
            unique: false,
            allowNull: true
        },
        score3: {
            type: DataTypes.REAL,
            unique: false,
            allowNull: true
        }
    });
    return restaurant;
};


module.exports = {
    Restaurant: Restaurant
}