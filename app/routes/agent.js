
var agent = require('../../app/controllers/agent');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/agent')
        .get(queryBuilder.queryBuilder, agent.list)
        .post(agent.create);

    app.route('/api/agent/:agentId')
        .get(agent.read)
        .patch(agent.update)
        //.delete(measurement.delete);

    app.param('agentId', agent.getById);
}