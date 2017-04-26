var models = require('../models');
var Customer = models.Customer;
var Loan = models.Loan;
var User = models.User;
var Sequelize = require('sequelize');
var _ = require('underscore');
//get Error Message Consized
var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errorName in err.errors) {
            if (err.errors[errorName].message) {
                return err.errors[errorName].message;
            }
        }
    } else {
        return 'Unknown Server Error';
    }
}

exports.list = function (req, res) {
    req.options.include = [Loan];
    Customer.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.customer);
}

exports.getById = function (req, res, next) {
    Customer.findOne({
        where: { id: req.params.customerId },
    }).then(function (obj) {
        req.customer = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
} 

exports.create = function (req, res) {
    if (req.body.customer.id) {
        Customer.update(req.body.customer, {
            where: {
                id: req.body.customer.id
            }
        }).then(function (obj) {
            return res.json(obj);
        }).catch(function (error) {
            return res.status(400).send({ message: getErrorMessage(error) });
        });
    } else {
        Customer.create(req.body.customer).then(function (obj) {
            if (!obj) {
                return res.send({ message: "Error Occured while updataing" });
            }
            var objData = obj.get({
                plain: true
            });
            return res.json(objData);
        }).catch(function (err) {
            console.log(err);
            res.status(400).send({ message: getErrorMessage(err) });
        });
    }
}

exports.update = function (req, res) {
    Customer.update(req.body, {
        where: {
            id: req.params.customerId
        }
    }).then(function (obj) {
        return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });
}
