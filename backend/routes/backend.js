var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var mysql = require('mysql');
var {doSqlQuery, getConnection} = require('../utils/funcs');

router.get('/render/live' , function(req, res, next) {
	res.render('live', {uid: req.query.uid, vid: req.query.vid});
});

router.get('/problem/render', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM contents WHERE path='+mysql.escape('/class/'+req.query.class_id);
			return doSqlQuery(conn,sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			if (sql_res.results.length === 0) {
				res.render('problem',{
					content:"<h3>练习区</h3><p>还没有任何习题哦，看看别的地方吧！</p>"
				});
			} 
			else {
				console.log(" ========== CODE ========");
				console.log(sql_res.results[0].content);
				console.log(" ========= FINISH =======");
				res.render('problem',{
					content:sql_res.results[0].content
				});
			}
		}).
		catch(function(sql_res) {
			next(sql_res);
		});
});

router.get('*', function(req, res, next) {
	var result = {
		status : 'FAILED.',
		details : 'NO API MATCH!'
	};
	res.status(404).send(JSON.stringify(result));
});

module.exports = router;
