var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;
var randomString = require('../utils/funcs').randomString;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file')

function checkPermission(conn, class_id, user_id) {
	return new Promise((resolve,reject) => {
		if (typeof(class_id) == 'undefined') {
			conn.end();
			reject({
				status: 'FAILED.',
				details: 'Undefined class_id',
			});
			return ;
		}
		if (typeof(user_id) == 'undefined') {
			conn.end();
			reject({
				status: 'FAILED.',
				details: 'Undefined user_id',
			});
			return ;
		}
		let sql = 'SELECT * FROM classusers WHERE user_id = '+mysql.escape(user_id) + ' AND class_id = '+mysql.escape(class_id);
		doSqlQuery(conn,sql).
			then(function(packed) {
				let {conn, sql_res} = packed;
				if (sql_res.results.length === 0) {
					conn.end();
					reject({
						status: 'FAILED.',
						details: 'NOT_IN_CLASS.',
					});
					return;
				}
				resolve({conn:conn,role:sql_res.results[0].role});
			}).
			catch(function(err) {
				reject(err);
			});
	});
}

router.get('/delete', function (req, res, next) { //根据id删除班级
	let id = req.query.id;
	let sql = 'DELETE FROM classes WHERE id = ' + mysql.escape(id);
	getConnection().
		then(function (conn) {
			return doSqlQuery(sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/status', function(req, res, next) {
	if (typeof(req.session.user_id) === 'undefined') {
		res.send(JSON.stringify({
			status: 'FAILED.',
			details: 'NOT_LOGIN.'
		}));
		return ;
	}
	getConnection().
		then(function(conn) {
			return checkPermission(conn, req.body.class_id, req.session.user_id);
		}).
		then(function(packed) {
			let {conn, role} = packed;
			conn.end();
			res.send(JSON.stringify({
				status: 'SUCCESS.',
				results: {role:role},
			}));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/participants/delete', function(req, res, next) {
	let user_id = +req.session.user_id;
	let target_id = +req.body.user_id;
	let class_id = +req.body.class_id;
	let user_role = req.session.role;
	let target_role = undefined;
	getConnection().
		then(function(conn) {
			return checkPermission(conn, class_id, user_id);
		}).
		then(function(packed) {
			let {conn, role} = packed;
			user_role = role;
			return checkPermission(conn, class_id, target_id);
		}).
		then(function(packed) {
			let {conn, role} = packed;
			target_role = role;
			if (target_role <= user_role) {
				conn.end();
				return Promise.reject({status:"FAILED.",details:"PermissionDenied."});
			}
			let sql = 'DELETE FROM classusers WHERE user_id = '+mysql.escape(target_id) + ' AND class_id = '+mysql.escape(class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/participants/show', function (req, res, next) {
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).send('NOT_LOGIN.');
		return;
	}
	getConnection().
		then(function (conn) {
			return checkPermission(conn, req.body.class_id, req.session.user_id);
		}).
		then(function(packed) {
			let {conn, role} = packed;
			let sql = 'SELECT users.id, users.realname, users.nickname, users.email, classusers.role FROM users LEFT JOIN classusers ON classusers.user_id = users.id WHERE classusers.class_id = '+mysql.escape(req.body.class_id)+' ORDER BY classusers.role DESC';
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function (sql_res) {
			res.status(403).send(JSON.stringify(sql_res));
		});
});

router.post('/join', function (req, res, next) { //学生加入班级
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).send("NOT_LOGIN.");
		return;
	}
	if (req.session.role !== 2) {
		res.status(403).send("NOT_STUDENT.");
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT COUNT(*) FROM classusers WHERE class_id = ' + mysql.escape(req.body.class_id) + ' AND user_id = ' + mysql.escape(req.session.user_id);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results[0]['COUNT(*)'] !== 0) {
				conn.end();
				return Promise.reject("ALREADY_IN.");
			}
			let sql = 'INSERT INTO classusers (`class_id`,`user_id`,`role`) VALUES (' + mysql.escape(+req.body.class_id) + ',' + mysql.escape(+req.session.user_id) + ',' + mysql.escape(2) + ')';
			return doSqlQuery(conn, sql);

		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send('SUCCESS.');
		}).
		catch(function (sql_res) {
			res.status(403).send(sql_res);
		});
});

router.post('/invite/check', function (req, res, next) { //学生通过邀请码，找到对应班级
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).send("NOT_LOGIN.");
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT `id`,`title` FROM classes WHERE `invitation_code` = ' + mysql.escape(req.body.invitation_code);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			if (sql_res.results.length === 0) {
				return Promise.reject('The code is not found in the class list.');
			}
			res.send({
				status: 'SUCCESS.',
				class_id: sql_res.results[0].id,
				class_title: sql_res.results[0].title
			});
		}).
		catch(function (sql_res) {
			res.status(403).send({
				status: 'FAILED.',
				details: sql_res
			});
		});

});

router.post('/resources/query', function (req, res, next) {
	getConnection().
		then(function (conn) {
			var sql = 'SELECT resource FROM resources WHERE `class_id` = ' + mysql.escape(req.body.class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			let result = {
				status: 'SUCCESS.',
				resources: []
			};
			for (var key in sql_res.results) {
				result.resources.push(sql_res.results[key].resource);
			}
			conn.end();
			res.send(JSON.stringify(result, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/info/query', function (req, res, next) {
	let result = {
		status: undefined
	};
	getConnection().
		then(function (conn) {
			let sql = 'SELECT * FROM classes WHERE id = ' + mysql.escape(req.body.class_id);
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
				result.info = sql_res.results[0];
				let sql = 'SELECT resource from resources WHERE class_id = ' + mysql.escape(req.body.class_id);
				return doSqlQuery(conn, sql);
			}
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			result.resources = [];
			for (var key in sql_res.results) {
				result.resources.push(sql_res.results[key].resource);
			}
			result.status = "SUCCESS.";
			conn.end();
			res.send(JSON.stringify(result, null, 3));
		}).
		catch(function (result) {
			if (result.status === 'FAILED.')
				res.send(JSON.stringify(result, null, 3));
		});
});

router.post('/info/update', function (req, res, next) {
	logger.info('>>>UPDATE CLASS INFO', req.body);
	let info = {
		description: req.body.info.description,
		notice: req.body.info.notice,
		title: req.body.info.title
	};
	let resources = req.body.resources;
	let sqls = [];
	let sql = 'UPDATE classes SET ';
	for (let key in info) {
		sql += key + '=';
		sql += mysql.escape(info[key]);
		sql += ',';
	}
	sql = sql.substr(0, sql.length - 1);
	sql += ' WHERE id = ' + mysql.escape(req.body.class_id);
	sqls.push(sql);
	sql = 'DELETE  FROM resources WHERE class_id = ' + mysql.escape(req.body.class_id);
	sqls.push(sql);
	sql = 'INSERT INTO `resources` (`class_id`, `resource`) VALUES ';
	for (let w in resources) {
		sql += '(' + mysql.escape(req.body.class_id) + ',' + mysql.escape(resources[w]) + '),';
	}
	sql = sql.substr(0, sql.length - 1);
	sqls.push(sql);
	getConnection().
		then(function (conn) {
			return doSqlQuerySequential(conn, sqls);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/create', function (req, res, next) { //创建新班级
	console.log(req.session);
	if (req.session.role != 1 && req.session.role != 0) {
		res.status(403).send('Only teacher can create a course.');
		return;
	}
	var title = req.body.title;
	var description = req.body.description;
	var invitation_code = randomString(20);
	var resources = req.body.resources;
	if (title === undefined || title.length < 3) {
		res.send(JSON.stringify({
			status: 'FAILED.',
			details: 'WRONG TITLE.'
		}));
	} else {
		let result = {};
		getConnection().
			then(function (conn) {
				let sql = 'INSERT INTO classes (`title`, `description`, `invitation_code`, `registration_date`, `type`) VALUES (' +
					mysql.escape(title) + ',' + mysql.escape(description) + ',' + mysql.escape(invitation_code) + ',' + mysql.escape(new Date()) + ',' + mysql.escape(+req.body.type) + ')';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				result.id = sql_res.results.insertId;
				result.status = 'SUCCESS.';
				logger.info(sql_res.results);
				result.invitation_code = invitation_code;
				let sql = 'INSERT INTO `resources` (`class_id`, `resource`) VALUES ';
				for (let w in resources) {
					sql += '(' + mysql.escape(result.id) + ',' + mysql.escape(resources[w]) + '),';
				}
				sql = sql.substr(0, sql.length - 1);
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				let sql = 'INSERT INTO `classusers` (`class_id`,`role`,`user_id`,`registration_date`) VALUES (' + mysql.escape(+result.id) + ',' + mysql.escape(0) + ',' + mysql.escape(+req.session.user_id) + ',' + mysql.escape(new Date()) + ')';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				conn.end();
				res.send(JSON.stringify(result, null, 3));
			}).
			catch(function (sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			});
	}
});

router.post('/public/fetch', function (req, res, next) {//公开课程目录获取
	if (typeof(req.body.page_number) === 'undefined') {
		res.status(403).send('Pagenum not defined.');
		return;
	}
	if (typeof(req.body.page_size) === 'undefined') {
		req.body.page_size = 20;
		logger.warn('Page size not defined...');
	}
	let m = (+req.body.page_number - 1) * req.body.page_size;
	let n = (+req.body.page_number) * req.body.page_size;
	let sql = 'SELECT * FROM classes LIMIT ' + m + ',' + n;
	getConnection().
		then(function (conn) {
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.status(403).send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/my_course/fetch', function (req, res, next) {
	if (typeof(req.body.page_number) == 'undefined') {
		res.status(403).send('Pagenum not defined.');
		return;
	}
	if (typeof(req.body.page_size) === 'undefined') {
		req.body.page_size = 20;
		logger.warn('Page size not defined...');
		return;
	}
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).send('User not login...');
		return;
	}
	let m = (+req.body.page_number - 1) * req.body.page_size;
	let n = (+req.body.page_number) * req.body.page_size;
	let sql = 'SELECT classes.id, classes.title, classusers.registration_date FROM classes LEFT JOIN classusers ON classusers.class_id = classes.id AND role=' + mysql.escape(req.session.role) + ' WHERE classusers.user_id = ' + mysql.escape(+req.session.user_id) + ' ORDER BY classusers.registration_date DESC';
	getConnection().
		then(function (conn) {
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.status(403).send(JSON.stringify(sql_res));
		});
});

router.post('/liveid/query', function (req, res, next) {
	let result = {
		status: undefined
	};
	getConnection().
		then(function (conn) {
			let sql = 'SELECT * FROM lives WHERE class = ' + mysql.escape(req.body.class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let {conn, sql_res} = packed;
			result.liveplayer_uid = sql_res.results[0].liveplayer_uid;
			result.liveplayer_vid = sql_res.results[0].liveplayer_vid;
			result.status = "SUCCESS.";
			console.log('fuckfuck');
			console.log(result);
			conn.end();
			res.send(JSON.stringify(result, null, 3));
		}).
		catch(function (result) {
			if (result.status === 'FAILED.')
				res.send(JSON.stringify(result, null, 3));
		});
});

module.exports = router;
