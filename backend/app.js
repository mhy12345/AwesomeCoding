var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var session = require('express-session');

var api = require('./routes/api');
var api_user = require('./routes/user');
var api_class = require('./routes/class');
var api_chat = require('./routes/chat');
var api_file = require('./routes/file');
var api_developer = require('./routes/developer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(history({
	rewrites: [
		{
			from: /^\/api\/.*$/,
			to: function(context) {
				return context.parsedUrl.path
			}
		}
	],
	htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
}));

app.use(session({
    secret: 'F67AC_app', //secret的值建议使用随机字符串
    cookie: {maxAge:  1 * 60 * 60 * 1000} // 过期时间（毫秒）//todo 延长过期时间
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 设置需要使用的 router 函数
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/api/developer',api_developer);
app.use('/api/user',api_user);
app.use('/api/class',api_class);
app.use('/api/chat',api_chat);
app.use('/api/file',api_file);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
