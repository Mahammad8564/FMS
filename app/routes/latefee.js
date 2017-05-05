
var latefee = require('../../app/controllers/latefee');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/latefee')
        .get(queryBuilder.queryBuilder, latefee.list)
        .post(latefee.create);

    app.route('/api/latefee/:latefeeId')
        .get(latefee.read)
        .patch(latefee.update)
        //.delete(measurement.delete);

    app.param('latefeeId', latefee.getById);
}