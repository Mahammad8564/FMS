"use strict";
module.exports = function (sequelize, DataTypes) {
    var LateFee = sequelize.define("LateFee", {
        minAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        maxAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        rtnCharge: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        lateFee: {
            type: DataTypes.DECIMAL,
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
                    // LateFee.hasMany(models.Loan);
                }
            }
        }
    );

    return LateFee;
};