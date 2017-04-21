﻿"use strict";
module.exports = function (sequelize, DataTypes) {
    var Customer = sequelize.define("Customer", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Customer name must be unique.'
            },
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: DataTypes.STRING,
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        image1: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        image2: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        image3: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        image4: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        image5: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        image6: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
            classMethods: {
                associate: function (models) {

                    Customer.hasMany(models.Loan);

                    Customer.belongsTo(models.Agent, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: true
                        }
                    });
                }
            }
        }
    );

    return Customer;
};