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


//{
//    "name": "Hardik Patel",
//    "gender": "Male",
//    "dob" : "2/23/2017",
//    "annerversary" :"2/23/2010",
//    "phone" : "9033269174",
//    "mobile" : "9033269174",
//    "email" : "akashdeep38@gmail.com",
//    "address" : "c-305, Bharat nagar",
//    "billingAddress" : "c-305, Bharat nagar",
//    "remark" : "anything",
//    "isActive" : true,
//    "createdById" : 1
//  }

//getting List of
//For Geting list of Measurements
exports.list = function (req, res) {
    //include: [{ model: User, as: 'createdBy' }]
    req.options.include = [Loan];
    // req.options.distinct = true;
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
        // include: [{ model: User, as: 'createdBy', attributes: ["fullName", "email", "id"] }, CustomerMeasurement]
    }).then(function (obj) {
        req.customer = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
} 

exports.create = function (req, res) {
    // req.body.createdById = req.user.id;
    if (req.files && req.files.length > 0) {
        req.body.customer.image1 = req.files[0].filename;
        req.body.customer.image2 = req.files[1].filename;
        req.body.customer.image3 = req.files[2].filename;
        req.body.customer.image4 = req.files[3].filename;
        req.body.customer.image5 = req.files[4].filename;
        req.body.customer.image6 = req.files[5].filename;
    }
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
        }).catch(function (error) {
            console.log(error);
            res.status(400).send({ message: getErrorMessage(error) });
        });
    }
}

// exports.update = function (req, res) {
//     var style = req.style;
//     _.forEach(req.body, function (val, key) {
//         style.dataValues[key] = val;
//     });
//     Style.update(style.dataValues, {
//             where: {
//                 id: req.params.styleId
//             }
//         })
//      .then(function (obj) {
//          return res.json(obj);
//     }).catch(function (error) {
//         return res.status(400).send({ message: getErrorMessage(error) });
//     });

// }

exports.update = function (req, res) {
console.log(req.body);
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
