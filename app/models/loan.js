"use strict";
module.exports = function (sequelize, DataTypes) {
    var Loan = sequelize.define("Loan", {
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        loanTenure: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        loanTenureOption: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        installmentAmount: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        disbursementAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        interestRate: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        insOther: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        processingCharge: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        loanAmount: {
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
                    
                    Loan.hasMany(models.Installment);

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