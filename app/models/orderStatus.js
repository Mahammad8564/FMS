"use strict";
module.exports = function (sequelize, DataTypes) {
    var OrderStatus = sequelize.define("OrderStatus", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Order Status must be unique.'
            },
        },
        interestRate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otherCharges: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
            classMethods: {
                associate: function (models) {
                    OrderStatus.hasMany(models.Loan);
                }
            }
        }
    );

    return OrderStatus;
};