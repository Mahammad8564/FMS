"use strict";
module.exports = function (sequelize, DataTypes) {
    var Installment = sequelize.define("Installment", {
        installmentNumber: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        installmentAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
        }
    }, {
            classMethods: {
                associate: function (models) {
                    Installment.belongsTo(models.Loan, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Installment;
};