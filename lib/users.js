'use strict';
var User = function(sequelize, DataTypes){
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
        },

        img_url: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });
};

module.exports = {User: User};