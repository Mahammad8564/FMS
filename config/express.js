var config = require('./config.js');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var models = require("../app/models/index");


module.exports = function(){
    var app = express();
    models.sequelize.sync().then(function () {
        var server = app.listen(app.get('port'), function () {

        });
    });

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended : true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/helper/uploadFile')(app);
    
    //define routing here...
    require('../app/routes/user.js')(app);
    require('../app/routes/index.js')(app);
    require('../app/routes/customer.js')(app);
    require('../app/routes/agent.js')(app);
    require('../app/routes/loan.js')(app);
    require('../app/routes/orderStatus.js')(app);
    require('../app/routes/installment')(app);

    app.use(express.static('./public'));
    app.use(express.static('./uploads'));
    return app;

}