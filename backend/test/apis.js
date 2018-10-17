// 一个没有监听端口的 Express 实例
const app = require('../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest')(app);
// 断言测测试库
const assert = require('power-assert');
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);

describe('# Test user module ...', function () {
	it('Get info', function(done) {
		request
			.get('/api/info')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});
    it('Get the default session', function (done) {
        request
            .get('/api/user/session') // 接口地址
            .expect(200) // 判断状态码
            .end(function (err, res) { // 请求结束后拿到返回的数据
                if (err) return done(err);
                done();
            });
    });
	it('Login with empty params...', function (done) {
		request
			.post('/api/user/login', { })
			.expect(403)
			.end(function (err, res) {
				if (err) return done(err);
				done();
			});
	});
});

