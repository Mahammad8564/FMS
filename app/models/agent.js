"use strict";
module.exports = function (sequelize, DataTypes) {
    var Agent = sequelize.define("Agent", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Agent name must be unique.'
            },
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
            classMethods: {
                associate: function (models) {
                    Agent.hasMany(models.Customer);
                }
            }
        }
    );

    return Agent;
};