// 讨论区的api
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file');

router.post('/ban', function (req, res, next) { //添加禁言名单 @调整部分逻辑 TODO 确认正确性
	let userid = req.body.userid;
	let classid = req.body.classid;
	let status = req.body.status;

	let tag = 0;
	let resp = {
		status: '',
		results: {},
	};
	getConnection().
		then(function (conn) {
			let sql = 'select * from bannedlist where userid = ' + userid + ' and classid = ' + classid;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			let sql = "";
			if (sql_res.results.length > 0) tag = 1;
			if (tag === 1) {
				var id = sql_res.results[0].id;
				sql = 'update bannedlist set status = ' + status + ' where id = ' + id;
			} else {
				sql = 'insert into bannedlist (`userid`, `classid`, `status`) VALUES ("' +
					userid + '","' + classid + '","' + status + '")';
			}
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			if (sql_res.status === 'SUCCESS.') {
				resp.status = "SUCCESS.";              // 成功注册
				resp.results = req.query;
			} else {
				resp.status = 'FAILED.';
				resp.details = result.details;
			}
			res.send(JSON.stringify(resp));
			conn.end();
			logger.info("[res] ", resp);
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		})
});


router.post('/add_comments', function (req, res, next) {
	let userid = req.body.userid;
	let classid = req.body.classid;
	let message = req.body.message;

	let registration_date = mysql.escape(new Date());
	console.log(">>>>>>>>/add_comments");
	console.log(userid);
	var resp = {};
	if (userid === undefined || classid === undefined || message.length > 200) {
		resp.status = 'FAILED.';
		resp.details = 'ILLEGAL INPUT.';
		res.send(JSON.stringify(resp));
		logger.info("ERROR WHILING ADDING A COMMENT");
	} else {
		//被禁言
		getConnection().
			then(function (conn) {
				let sql = 'select * from bannedlist where userid = ' + userid + ' and classid = ' + classid;
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				if (sql_res.results.length > 0 && sql_res.results[0].status === 0) {
					resp.status = 'FAILED.';
					resp.details = 'STILL IN BLACKLIST.';
					res.send(JSON.stringify(resp));
					logger.info("FORBID");
					conn.end();
					return Promise.reject({
						status: 'SKIPPED.'
					});
				}
				else {
					let sql = 'insert into forums (`userid`, `classid`, `message`, `registration_date`) VALUES ("' +
						userid + '","' + classid + '","' + message + '",' + registration_date + ')';
					return doSqlQuery(conn, sql);
				}
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				console.log(">>>>>>>>/add_comments");
				console.log(sql_res);
				resp.status = "SUCCESS.";
				resp.results = {};
				resp.results.userid = userid;
				resp.results.registration_date = registration_date;
				resp.results.message = message;
				res.send(JSON.stringify(resp));
				conn.end();
			}).
			catch(function (sql_res) {
				res.send(sql_res);
			})
	}
});

router.post('/add_comments/posts', function(req, res, next) {
	let userid = req.body.userid;
	let forumid = req.body.forumid;
	let message = req.body.message;
	let classid = req.body.classid;
	let registration_date = mysql.escape(new Date());
	console.log(">>>>>>>>/add_comments");
	var resp = {};
	if (userid === undefined || forumid === undefined || message.length > 200) {
		resp.status = 'FAILED.';
		resp.details = 'ILLEGAL INPUT.';
		res.send(JSON.stringify(resp));
		logger.info("ERROR WHILING ADDING A COMMENT");
	} else {
		getConnection().
			then(function(conn) {
				console.log(userid);
				console.log(forumid);
				console.log(message);
				let sql = 'insert into posts (`userid`, `forumid`, `message`, `registration_date`) VALUES ("' +
					userid + '","' + forumid + '","' + message + '",' + registration_date + ')';
				return doSqlQuery(conn, sql);
			}).
			then(function(packed) {
				let {conn, sql_res} = packed;
				console.log(">>>>>>>>/add_comments/posts complete");
				console.log(sql_res);
				resp.status = "SUCCESS.";
				resp.results = {};
				resp.results.userid = userid;
				resp.results.registration_date = registration_date;
				resp.results.message = message;
				res.send(JSON.stringify(resp));
				conn.end();
			}).
			catch(function(sql_res) {
				res.send(sql_res);
			})
	}
});


router.post('/info/query', function(req, res, next) {
	let result = {
		status: undefined
	};
	getConnection().
		then(function (conn) {
			let sql = 'SELECT * FROM forums WHERE classid = ' + req.body.class_id;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results.length === 0) {
				res.send(JSON.stringify(result, null, 3));
				conn.end();
				return Promise.reject({
					status: 'NOT FOUND.'
				});
			}
			else {
				result.status = "SUCCESS.";
				result.chatrecords = [];
				for (var i = 0; i < sql_res.results.length; i++) {
					var chatrecord = {};
					chatrecord.userid = sql_res.results[i].userid;
					chatrecord.message = sql_res.results[i].message;
					chatrecord.registration_date = sql_res.results[i].registration_date;
					chatrecord.forumid = sql_res.results[i].id;
					result.chatrecords.push(chatrecord);
				}
				console.log(">>>>>>>>>>>/info/query/result");
				console.log(result);
				res.send(JSON.stringify(result));
			}
		}).
		catch(function (result) {
			if (result.status === 'FAILED.')
				res.send(JSON.stringify(result, null, 3));
		});
});

router.post('/info/query/posts', function(req, res, next) {
	let result = {
		status : undefined
	};
	console.log(req.body.forumid);
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM forums WHERE id = ' + req.body.forumid;
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			console.log(sql_res);
			result.classid = sql_res.results[0].classid;
			result.theme = sql_res.results[0].message;
			result.userid = sql_res.results[0].userid;
			let sql = 'SELECT * FROM posts WHERE forumid = ' + req.body.forumid;
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results.length === 0) {
				res.send(JSON.stringify(result, null,3));
				conn.end();
				return Promise.reject({
					status : 'NOT FOUND.'
				});
			}
			else {
				result.status = "SUCCESS.";
				result.chatrecords = [];
				for(var i=0 ; i < sql_res.results.length ; i++){
					var chatrecord = {};
					chatrecord.userid = sql_res.results[i].userid;
					chatrecord.message = sql_res.results[i].message;
					chatrecord.registration_date = sql_res.results[i].registration_date;
					result.chatrecords.push(chatrecord);
				}
				console.log(">>>>>>>>>>>/info/query/posts/result");
				console.log(result);
				res.send(JSON.stringify(result));
			}
		}).
		catch(function(result) {
			if (result.status === 'FAILED.')
				res.send(JSON.stringify(result, null,3));
		});
});


router.post('/clear_comments', function (req, res, next) {
	let classid = req.body.classid;
	var resp = {};
	if (classid === undefined) {
		resp.status = 'FAILED.';
		resp.details = 'ILLEGAL INPUT.';
		res.send(JSON.stringify(resp));
		console.log("ERROR WHILING ADDING A COMMENT");
	} else {
		getConnection().
			then(function (conn) {
				let sql = 'delete from forums where classid = ' + classid;
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				console.log(">>>>>>>>>clear");
				console.log(sql_res);
				res.send(JSON.stringify(sql_res));
				coon.end();
			}).
			catch(function (sql_res) {
				res.send(sql_res);
			})
	}
});

module.exports = router;
