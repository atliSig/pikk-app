'use strict';
var User = function(sequelize, DataTypes){
    var user = sequelize.define('member', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey:true,
                autoIncrement:true
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
            google: {
                type:DataTypes.JSON
            },
            img_url: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        });
    return user;
};


function getFriends(sequelize, userid, cb, err){
    var id = 1;
    sequelize.query('SELECT * ' +
        'FROM members ' +
        'WHERE id IN ( ' +
        '   SELECT "memberId" '+
        '   FROM "groupMembers" '+
        '   WHERE "groupId" IN( '+
        '      SELECT "groupId" ' +
        '      FROM "groupMembers" '+
        '      WHERE "memberId" = ?' +
        '   )' +
        '   EXCEPT' +
        '   SELECT ?'+
        ')', {
        model: User,
        replacements: [userid, userid],
        type: sequelize.QueryTypes.SELECT
    })
        .then(cb, err);
}

module.exports = {User: User};