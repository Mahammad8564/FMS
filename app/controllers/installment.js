var models = require('../models');
var Installment = models.Installment;
var Loan = models.Loan;
var Customer = models.Customer;
var LoanOption = models.LoanOption;
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

//getting List of 
//For Geting list of Installments
exports.list = function (req, res) {
    // req.options.include = [Customer,LoanOption];
    Installment.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.today = function (req, res) {
    var today = new Date();
    today.setHours(0,0,0,0);
    Installment.findAll({
        where: { dueDate: today,status: false},//attributes: ["fullName", "email", "id"]
        include: [{ model: Loan, include: [Customer]}]
    }).then(function (obj) {
        res.json(obj);
    }).catch(function (err) {
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.installment);
}

exports.getById = function (req,res,next) {
    Installment.findAll({
        where: { LoanId: req.params.installmentId},//attributes: ["fullName", "email", "id"]
        include: [{ model: Loan, include: [Customer]}]
    }).then(function (obj) {
        req.installment = obj;
        next();
    }).catch(function (err) {
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    Installment.create(req.body).then(function (obj) {
        if (!obj) {
            return res.send({ message: "Error Occured while updataing" });
        }
        var objData = obj.get({
            plain: true
        });
        res.json(objData);
    }).catch(function (error) {
        res.status(400).status(500).send({ message: getErrorMessage(error) });
    });
}

exports.update = function (req, res) {
    // var installment = req.installment;
    // _.forEach(req.body, function (val, key) {
    //     installment.dataValues[key] = val;
    // });
    Installment.update(req.body, {
            where: {
                id: req.params.installmentId
            }
        })
     .then(function (obj) {
         return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });

}