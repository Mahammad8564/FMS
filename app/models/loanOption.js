"use strict";
module.exports = function (sequelize, DataTypes) {
    var LoanOption = sequelize.define("LoanOption", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Order Status must be unique.'
            },
        },
        interestRate: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        insOther: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        processingCharge: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        includeCharges: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
            classMethods: {
                associate: function (models) {
                    LoanOption.hasMany(models.Loan);
                }
            }
        }
    );

    return LoanOption;
};