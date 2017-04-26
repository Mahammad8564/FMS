
var loanOption = require('../../app/controllers/loanOption');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/loanOption')
        .get(queryBuilder.queryBuilder, loanOption.list)
        .post(loanOption.create);

    app.route('/api/loanOption/:loanOptionId')
        .get(loanOption.read)
        .patch(loanOption.update)
        //.delete(loanOption.delete);

    app.param('loanOptionId', loanOption.getById);
}