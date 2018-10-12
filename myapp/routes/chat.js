var express = require('express');
var router = express.Router();

var getConnection = require('../utils/funcs').getConnection;
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;

router.post('/ban', function(req, res, next) { //添加禁言名单 @调整部分逻辑 TODO 确认正确性
	let userid = req.body.userid;
	let classid = req.body.classid;
	let status = req.body.status;

	let tag = 0;
	let resp = {
		status: '',
		results: {},
	};
	getConnection().
		then(function(conn) {
			let sql = 'select * from bannedlist where userid = ' + userid + ' and classid = ' + classid;
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
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
		then(function(packed) {
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
			console.log("[res] ", resp);
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		})
});


router.get('/add_comments', function(req, res, next) {
	let userid = req.body.userid;
	let classid = req.body.classid;
	let message = req.body.message;

	let registration_date = moment().format('YYYY-MM-DD HH-mm-ss');

	var resp = {};
	if (userid === undefined || classid === undefined || message.length > 200) {
		resp.status = 'FAILED.';
		resp.details = 'ILLEGAL INPUT.';
		res.send(JSON.stringify(resp));
		console.log("ERROR WHILING ADDING A COMMENT");
	} else {
		//被禁言
		getConnection().
			then(function(conn) {
				let sql = 'select * from bannedlist where userid = ' + userid + ' and classid = ' + classid;
				return doSqlQuery(conn, sql);
			}).
			then(function(packed) {
				let {conn, sql_res} = packed;
				if (sql_res.results.length > 0 && sql_res.results[0].status === 0) {
					resp.status = 'FAILED.';
					resp.details = 'STILL IN BLACKLIST.';
					res.send(JSON.stringify(resp));
					console.log("FORBID");
					conn.end();
					return Promise.reject({
						status : 'SKIPPED.'
					});
				} 
				else {
					let sql = 'insert into forums (`userid`, `classid`, `message`, `registration_date`) VALUES ("' +
						userid + '","' + classid + '","' + message + '","' + registration_date + '")';
					return doSqlQuery(conn, sql_res);
				}
			}).
			then(function(packed) {
				let {conn, sql_res} = packed;
				conn.end();
				res.send(sql_res);
			}).
			catch(function(sql_res) {
				res.send(sql_res);
			})
	}
});

module.exports = router;
