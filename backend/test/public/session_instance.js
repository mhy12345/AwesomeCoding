// instance of `supertest-session`

// 一个没有监听端口的 Express 实例
const {app, server} = require('../../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest-session')(app);

module.exports = request;
