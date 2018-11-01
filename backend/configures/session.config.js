var session = require('express-session')({
	secret: 'F67AC_app',  //todo secret的值建议使用随机字符串
	cookie: { maxAge: 60 * 60 * 1000 }, // 过期时间（毫秒）//todo 延长过期时间
	resave: true,
	saveUninitialized: true
});

module.exports = session;
