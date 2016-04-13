var express      = require('express');
    path         = require('path');
    favicon      = require('serve-favicon');
    logger       = require('morgan');
    cookieParser = require('cookie-parser');
    bodyParser   = require('body-parser');
    requestLog   = require('./middlewares/request_log');
    helmet       = require('helmet');

// MongoDB 连接
// require('./models');

var routes = require('./routes/index');

var app = express();

// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet())

// Request logger 请求时间
app.use(requestLog);

// 静态文件缓存配置
var options = {
    dotfiles    : 'ignore',
    etag        : false,
    extensions  : ['htm', 'html'],
    index       : false,
    maxAge      : '1d',
    redirect    : false,
    setHeaders  : function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};
app.use(express.static(path.join(__dirname, 'public'), options));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
