//require('events').EventEmitter.defaultMaxListeners = 15;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var history = require('connect-history-api-fallback');
var session = require('./configures/session.config');

var api = require('./routes/api');
var api_user = require('./routes/user');
var api_class = require('./routes/class');
var api_chat = require('./routes/discussion_board');
var api_file = require('./routes/file');
var api_developer = require('./routes/developer');
var api_problem = require('./routes/problem');
var api_content = require('./routes/content');
var api_backend = require('./routes/backend');
var api_live = require('./routes/live');

var log4js = require("log4js");
var log4js_config = require("./configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('backend-http');

var app = express();


app.use(log4js.connectLogger(logger,{level:'debug'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(history({
	rewrites: [
		{
			from: /^\/api\/.*$/,
			to: function (context) {
				return context.parsedUrl.path
			}
		},
		{
			from: /^\/backend\/.*$/,
			to: function(context) {
				return context.parsedUrl.path
			}
		}
	],
	htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
}));

// session for app
app.use(session);

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// 设置需要使用的 router 函数
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/api/developer', api_developer);
app.use('/api/user', api_user);
app.use('/api/class', api_class);
app.use('/api/live', api_live);
app.use('/api/chat', api_chat);
app.use('/api/file', api_file);
app.use('/api/content', api_content);
app.use('/api/problem', api_problem);
app.use('/api', api);
app.use('/backend', api_backend);

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
