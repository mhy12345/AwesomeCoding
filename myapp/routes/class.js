var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;
var do_sql_query_sequential = funcs.do_sql_query_sequential;
var randomString = funcs.randomString;
var moment = require('moment');
var mysql=require('mysql');

router.get('/delete', function(req, res, next) { //根据id删除班级
	var id = req.query.id;
	var sql = 'DELETE FROM classes WHERE id = ' + mysql.escape(id);
	do_sql_query(sql,function(result) {
		res.send(JSON.stringify(result,null,3));
	});
	sql = 'DELETE FROM classusers WHERE id = ' + mysql.escape(id);
	do_sql_query(sql,function(result) {
		//to do more,设计更好的适合前段解析的返回
	});
});

router.post('/resources/query', function(req, res, next) {
	var sql = 'SELECT resource FROM resources WHERE `class_id` = '+mysql.escape(req.body.class_id);
	var result = {};
	do_sql_query(sql,function(sql_res) {
		console.log(sql_res);
		result.status = 'SUCCESS.';
		result.results = [];
		for (var w in sql_res.results) {
			result.results.push(sql_res.results[w].resource);
		}
		res.send(JSON.stringify(result,null,3));
	});
});

router.post('/info/query',function(req, res, next) {
	console.log('>>>QUERY CLASS INFO',req.body);
	var sql = 'SELECT * FROM classes WHERE id = '+mysql.escape(req.body.class_id);
	var result = {};
	do_sql_query(sql,function(sql_res) {
		if (sql_res.results.length === 0) {
			result.status = "NOT FOUND.";
			res.send(JSON.stringify(result,null,3));
		} else {
			result.info = sql_res.results[0];
			var sql = 'SELECT resource from resources WHERE class_id = '+mysql.escape(req.body.class_id);
			do_sql_query(sql,function(sql_res) {
				result.resources = [];
				for (var key in sql_res.results) {
					result.resources.push(sql_res.results[key].resource);
				}
				result.status = "SUCCESS.";
				console.log(result);
				res.send(JSON.stringify(result,null,3));
			});
		}
	});
});

router.post('/info/update', function(req, res, next) {
	console.log('>>>UPDATE CLASS INFO',req.body);
	var info = req.body.info;
	var resources = req.body.resources;
	delete info.registration_date;
	delete info.id;
	delete info.invitation_code;
	var sqls = [];
	var sql = 'UPDATE classes SET ';
	for (var key in info) {
		sql += mysql.escape(key) + '=';
		if (typeof(info[key]) == 'string')
			sql += '"' + mysql.escape(info[key]) + '"';
		else
			sql += mysql.escape(info[key]);
		sql += ',';
	}
	sql = sql.substr(0,sql.length-1);
	sql += ' WHERE id = '+mysql.escape(req.body.class_id);
	sqls.push(sql);
	sql = 'DELETE  FROM resources WHERE class_id = '+mysql.escape(req.body.class_id);
	sqls.push(sql);
	sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
	for (var w in resources) {
		sql += '('+mysql.escape(req.body.class_id)+',"'+mysql.escape(resources[w])+'"),';
	}
	sql = sql.substr(0,sql.length-1);
	sqls.push(sql);
	console.log(sqls);
	do_sql_query_sequential(sqls,function(sql_res) {
		console.log(sql_res);
		res.send(JSON.stringify(sql_res));
	});
});

router.post('/create', function(req, res, next) { //创建新班级
	var title = req.body.title;
	var description = req.body.description;
	var invitation_code = randomString(20);
	var registration_date = moment().format('YYYY-MM-DD HH-mm-ss');
	var resources = req.body['resources'];
	var result = {};
	if (title === undefined || title.length < 3) {
		result.status = 'FAILED.';
		result.details = 'WRONG TITLE.';
		res.send(JSON.stringify(result));
		console.log("ERROR CREATING CLASS");
	} else {
		var sql = 'INSERT INTO classes (`title`,`description`,`invitation_code`,`registration_date`) VALUES ("' +
                        mysql.escape(title) + '","' +mysql.escape(description)+'","'+mysql.escape(invitation_code)+'","'+mysql.escape(registration_date) + '")';
		console.log(sql);
		do_sql_query(sql,function(sql_res) {
            do_sql_query('SELECT MAX(`id`) FROM classes', function (sql_res) {
                result.status = 'SUCCESS.';
                console.log(sql_res.results);
                result.id = sql_res.results[0]['MAX(`id`)'];
                result.invitation_code = invitation_code;
                var sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
                for (var w in resources) {
                    sql += '(' + mysql.escape(result.id) + ',"' + mysql.escape(resources[w]) + '"),';
                }
                sql = sql.substr(0, sql.length - 1);
                console.log(sql);
                do_sql_query(sql, function (sql_res) {
                    res.send(JSON.stringify(result, null, 3));
                });
            });
		});
	}
});


//分页获取
router.post('/fetch', function(req, res, next) {
	var m = (req.body.m === undefined? null: req.body.m); //从第几条开始取
	var n = (req.body.n === undefined? null: req.body.n);
	var sql = 'SELECT * FROM classes LIMIT ' + m + ',' + n;
	console.log(sql);
	do_sql_query(sql,function(result) {
		console.log(result);
		res.send(JSON.stringify(result,null,3));
	});
});

module.exports = router;
