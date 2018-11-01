var express = require('express');
var router = express.Router();
var mysql=require('mysql');

var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;
var randomString = require('../utils/funcs').randomString;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file')

router.post('/save', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `contents` WHERE `code`='+mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			let sql = '';
			if (sql_res.results.length === 0)
				sql = 'INSERT INTO `contents` (`code`,`content`,`deltas`) VALUES ('+mysql.escape(req.body.code)+','+mysql.escape(req.body.content)+','+mysql.escape(req.body.deltas)+')';
			else
				sql = 'UPDATE `contents` SET `deltas`='+mysql.escape(req.body.deltas)+', `content` = '+mysql.escape(req.body.content)+' WHERE `code`='+mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send('SUCCESS.');
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/fetch/deltas', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `contents` WHERE `code`='+mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS',
				deltas: sql_res.results[0].deltas
			}));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/fetch/html', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT content FROM `contents` WHERE `code`='+mysql.escape(req.body.code);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS',
				content: sql_res.results[0].content,
			}));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});
module.exports = router;
