
var loan = require('../../app/controllers/loan');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/loan')
        .get(queryBuilder.queryBuilder, loan.list)
        .post(loan.create);

    app.route('/api/loan/:loanId')
        .get(loan.read)
        .patch(loan.update)
        //.delete(measurement.delete);

    app.param('loanId', loan.getById);
}