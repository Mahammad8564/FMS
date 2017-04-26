var models = require('../models');
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


//order status has fixed id as mentioned below. use accordingly
//1 : New
//2 : Stitching
//3 : Completed
//4 : Cancelled


//getting List of 
//For Geting list of LoanOptions
exports.list = function (req, res) {
    LoanOption.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.loanOption);
}

exports.getById = function (req,res,next) {
    LoanOption.findOne({
        where: { id: req.params.loanOptionId},
        //include: []
    }).then(function (obj) {
        req.loanOption = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    LoanOption.create(req.body).then(function (obj) {
        if (!obj) {
            return res.send({ message: "Error Occured while updataing" });
        }
        var objData = obj.get({
            plain: true
        });
        return res.json(objData);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(error) });
    });
}

exports.update = function (req, res) {
    var loanOption = req.loanOption;
    _.forEach(req.body, function (val, key) {
        loanOption.dataValues[key] = val;
    });
    LoanOption.update(loanOption.dataValues, {
            where: {
                id: req.params.loanOptionId
            }
        })
     .then(function (obj) {
         return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });

}