"use strict";
module.exports = function (sequelize, DataTypes) {
    var Loan = sequelize.define("Loan", {
        loanAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        loanTenure: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        installmentAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        disbursementAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        interestRate: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        otherCharges: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        guarantorName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
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
                    Loan.belongsTo(models.Customer, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Loan.belongsTo(models.OrderStatus, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Loan;
};