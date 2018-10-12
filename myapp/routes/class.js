var express = require('express');
var router = express.Router();
var {do_sql_query,get_connection,do_sql_query_sequential,randomString} = require('../utils/funcs');
var moment = require('moment');
var mysql=require('mysql');

router.get('/delete', function(req, res, next) { //根据id删除班级
	let id = req.query.id;
	let sql = 'DELETE FROM classes WHERE id = ' + mysql.escape(id);
	get_connection()
	.then(function(conn) {
		return do_sql_query(sql);
	})
	.then(function(packed) {
		let {conn,sql_res} = packed;
		res.send(JSON.stringify(sql_res,null,3));
	})
	.catch(function(sql_res) {
		res.send(JSON.stringify(sql_res,null,3));
	});
});

router.post('/resources/query', function(req, res, next) {
	get_connection()
	.then(function(conn) {
		var sql = 'SELECT resource FROM resources WHERE `class_id` = '+mysql.escape(req.body.class_id);
		return do_sql_query(conn,sql);
	})
	.then(function(conn,results) {
		conn.end();
		res.send(JSON.stringify(results,null,3));
	})
	.catch(function(results) {
		res.send(JSON.stringify(results,null,3));
	});
});

router.post('/info/query',function(req, res, next) {
	let result = {
		status : undefined
	};
	get_connection()
		.then(function(conn) {
			let sql = 'SELECT * FROM classes WHERE id = '+mysql.escape(req.body.class_id);
			return do_sql_query(conn,sql);
		})
		.then(function(packed) {
			let {conn,sql_res} = packed;
			console.log(conn,sql_res);
			if (sql_res.results.length === 0) {
				res.send(JSON.stringify(result,null,3));
				conn.end();
				return Promise.reject({
					status : 'NOT FOUND.'
				});
			} else {
				result.info = sql_res.results[0];
				let sql = 'SELECT resource from resources WHERE class_id = '+mysql.escape(req.body.class_id);
				return do_sql_query(conn,sql);
			}
		})
		.then(function(packed) {
			let {conn,sql_res} = packed;
			conn.end();
			if (sql_res.status !== 'SUCCESS.') {
				return Promise.reject({
					status : 'FAILED.',
					details : sql_res
				});
			} else {
				result.resources = [];
				for (var key in sql_res.results) {
					result.resources.push(sql_res.results[key].resource);
				}
				result.status = "SUCCESS.";
				res.send(JSON.stringify(result,null,3));
			}
		})
		.catch(function(result) {
			res.send(JSON.stringify(result,null,3));
		});
});

router.post('/info/update', function(req, res, next) {
	console.log('>>>UPDATE CLASS INFO',req.body);
	let info = {
		description : req.body.description,
		notice : req.body.notice,
		title : req.body.title
	};
	let resources = req.body.resources;
	let sqls = [];
	let sql = 'UPDATE classes SET ';
	for (let key in info) {
		sql += key + '=';
		sql += mysql.escape(info[key]);
		sql += ',';
	}
	sql = sql.substr(0,sql.length-1);
	sql += ' WHERE id = '+mysql.escape(req.body.class_id);
	sqls.push(sql);
	sql = 'DELETE  FROM resources WHERE class_id = '+mysql.escape(req.body.class_id);
	sqls.push(sql);
	sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
	for (let w in resources) {
		sql += '('+mysql.escape(req.body.class_id)+','+mysql.escape(resources[w])+'),';
	}
	sql = sql.substr(0,sql.length-1);
	sqls.push(sql);
	console.log(sqls);
	get_connection()
	.then(function(conn) {
		return do_sql_query_sequential(conn,sqls);
	})
	.then(function(packed) {
		let {conn,sql_res} = packed;
		conn.end();
		res.send(JSON.stringify(sql_res));
	})
	.catch(function(sql_res) {
		res.send(JSON.stringify(sql_res));
	});
});

router.post('/create', function(req, res, next) { //创建新班级
	var title = req.body.title;
	var description = req.body.description;
	var invitation_code = randomString(20);
	var resources = req.body.resources;
	if (title === undefined || title.length < 3) {
		res.send(JSON.stringify({
			status : 'FAILED.',
			details : 'WRONG TITLE.'
		}));
	} else {
		let result = {};
		get_connection()
			.then(function(conn) {
				let sql = 'INSERT INTO classes (`title`,`description`,`invitation_code`,`registration_date`) VALUES (' +
					mysql.escape(title) + ',' +mysql.escape(description)+','+mysql.escape(invitation_code)+','+mysql.escape(new Date()) + ')';
				return do_sql_query(conn,sql);
			})
			.then(function(packed) {
				let {conn,sql_res} = packed;
				let sql = 'SELECT MAX(`id`) FROM classes';
				return do_sql_query(conn,sql);
			})
			.then(function(packed) {
				let {conn,sql_res} = packed;
				result.status = 'SUCCESS.';
				console.log(sql_res.results);
				result.id = sql_res.results[0]['MAX(`id`)'];
				result.invitation_code = invitation_code;
				let sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
				for (let w in resources) {
					sql += '(' + mysql.escape(result.id) + ',' + mysql.escape(resources[w]) + '),';
				}
				sql = sql.substr(0, sql.length - 1);
				return do_sql_query(conn,sql);
			})
			.then(function(packed) {
				let {conn,sql_res} = packed;
				res.send(JSON.stringify(result, null, 3));
			})
			.catch(function(sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			});
	}
});


//分页获取
router.post('/fetch', function(req, res, next) {
	let m = (req.body.m === undefined? 0: req.body.m); //从第几条开始取
	let n = (req.body.n === undefined? 100: req.body.n);
	let sql = 'SELECT * FROM classes LIMIT ' + m + ',' + n;
	get_connection()
		.then(function(conn) {
			return do_sql_query(conn,sql);
		})
		.then(function(packed) {
			let {conn,sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res,null,3));
		})
		.catch(function(sql_res) {
			res.send(JSON.stringify(sql_res,null,3));
		});
});

module.exports = router;
