'use strict';

require('dotenv').config();
const DATABASE = process.env.DATABASE_URL;
var pg = require('pg');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(DATABASE);

// var pool = {max: 30, min: 0, idle: 10000}

module.exports = function(sequelize, DataTypes){
    return sequelize.define('pikk_user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(32),
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        first_name:{
            type: DataTypes.STRING
        },
        last_name:{
            type: DataTypes.STRING
        },
        nikk:{
            type: DataTypes.STRING(32),
            unique: true
        },

        google: {
            type:DataTypes.JSON
        }
    });
};
