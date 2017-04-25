
var installment = require('../../app/controllers/installment');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/installment')
        .get(queryBuilder.queryBuilder, installment.list)
        .post(installment.create);

    app.route('/api/installment/:installmentId')
        .get(installment.read)
        .patch(installment.update)

    app.route('/api/todaysInstallment')
        .get(installment.today);
        //.delete(measurement.delete);

    app.param('installmentId', installment.getById);
}