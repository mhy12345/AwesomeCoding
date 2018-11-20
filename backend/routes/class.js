var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var xlsx = require('node-xlsx');
var fs = require('fs');

var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;
var randomString = require('../utils/funcs').randomString;
var updateSocketSession = require('../utils/global').updateSocketSession;
var checkPermission = require('../utils/funcs').checkPermission;

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('class_log');
var path = require('path');
var createSign = require('../utils/sign').getSign;
const axios = require('axios');
const querystring = require('querystring');
var NewChannelTemplate = {
	appId: 'f6nom3tneq',
	timestamp: '',
	userId: '99c8b47fe1',
	name: '',
	channelPasswd: '111111'
};

Date.prototype.add_minute= function(minute){//日期加减
	return new Date(this.valueOf()+minute*1000*60);
};

router.get('/delete', function (req, res, next) { //根据id删除班级
	let id = req.query.id;
	let sql = 'DELETE FROM classes WHERE id = ' + mysql.escape(id);
	getConnection().
		then(function (conn) {
			return doSqlQuery(sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

/* 获取用户在课程中的角色，若用户在课程中，就把用户 session 中添加 `course_status` 字段，
 * req 字段： class_id
 * res 格式： 成功与否 & 用户在课程中的角色
 * 用于表示用户在课程中的角色，这样以后不用再检查用户是否在课堂了
 * 若用户不在课程中，`course_status` 就定义为 undefined
 */
router.post('/status', function (req, res, next) {
	logger.debug(req.session);
	logger.info('[post status]', req.body);
	if (typeof(req.session.user_id) === 'undefined') {
		res.send({
			status: 'FAILED.',
			details: 'NOT_LOGIN.'
		});
		return;
	}
	getConnection().
		then((conn) => {
			return checkPermission(conn, req.body.class_id, req.session.user_id);
		}).
		then((packed) => {
			let { conn, role } = packed;
			conn.end();
			req.session['course_status'] = role;
			updateSocketSession(req.session);
			res.send({
				status: 'SUCCESS.',
				results: { role: role },
			});
		}).
		catch((sql_res) => {
			res.send(sql_res);
		});
});

router.post('/participants/delete', function (req, res, next) {	// 退出班级或踢人
	var user_id = +req.session.user_id;
	var target_id = undefined;
	var target_realname = undefined;
	if (req.body.user_id === null)
		target_id = user_id;//当req.body.user为null的话，表示删除自己
	else
		target_id = +req.body.user_id;//否则表示删除指定用户
	let class_id = +req.body.class_id;
	let user_role = req.session.role;
	let target_role = undefined;
	getConnection().
		then(function (conn) {
			return checkPermission(conn, class_id, user_id);	// 检查自己的权限
		}).
		then(function (packed) {
			let { conn, role } = packed;
			user_role = role;
			return checkPermission(conn, class_id, target_id);	// 检查目标用户的权限
		}).
		then(function (packed) {
			let { conn, role } = packed;
			target_role = role;
			if (target_role <= user_role && target_id !== user_id) {	// 权限不比对方高
				conn.end();
				return Promise.reject({ status: "FAILED.", details: "PermissionDenied." });
			} else if (target_role === 0) {
				conn.end();
				return Promise.reject({ status: "FAILED.", details: "TeacherCannotQuit." });
			}
			let sql = 'DELETE FROM classusers WHERE user_id = ' + mysql.escape(target_id) +
				' AND class_id = ' + mysql.escape(class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			res.send(JSON.stringify(sql_res));
			if (target_id !== user_id) {	// 拉入黑名单
				let sql = `SELECT realname FROM users WHERE id = ${mysql.escape(target_id)};`;
				// logger.error('[kicked] sql=', sql);
				return doSqlQuery(conn, sql);
			}
			logger.fatal('[delete] im out');
			conn.end();		// 自己退出，不会拉黑
			return;
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			// logger.error('[kicked] results=', sql_res.results);
			target_realname = sql_res.results[0].realname;
			let sql = 'INSERT INTO blacklisting (user_id, realname, class_id) VALUES' +
				`(${mysql.escape(target_id)}, ${mysql.escape(target_realname)}, ${mysql.escape(class_id)});`;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
		}).
		catch(function (sql_res) {
			logger.error(sql_res);
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/participants/show', function (req, res, next) {
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).
			send('NOT_LOGIN.');
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT users.id, users.realname, users.nickname, users.email, classusers.role FROM users ' +
				'LEFT JOIN classusers ON classusers.user_id = users.id WHERE classusers.class_id = ' +
				mysql.escape(req.body.class_id) + ' ORDER BY classusers.role DESC';
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function (sql_res) {
			res.status(403).
				send(JSON.stringify(sql_res));
		});
});

router.post('/participants/show_blacklisting', function (req, res) {	// 返回黑名单
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).
			send('NOT_LOGIN.');
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT user_id, realname, date_time FROM blacklisting ' +
				`WHERE class_id = ${mysql.escape(req.body.class_id)} ;`;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(sql_res);
		}).
		catch(function (sql_res) {
			res.status(403).
				send(sql_res);
		});
});

router.post('/participants/white', function (req, res) {	// 取消拉黑
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).
			send('NOT_LOGIN.');
		return;
	}
	getConnection().
		then(function (conn) {
			return checkPermission(conn, req.body.class_id, req.session.user_id);
		}).
		then(function (packed) {
			let { conn, role } = packed;
			if (role > 1) {	// 权限不够
				res.status(403).
					send('PERMISSION_DENIED.');
				return;
			}
			let sql = `DELETE FROM blacklisting WHERE user_id = ${mysql.escape(req.body.user_id)} ;`;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send('SUCCESS.');
		}).
		catch(function (err) {
			res.status(403).
				send(err);
		})
});

router.post('/join', function (req, res, next) { //学生加入班级
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).
			send("NOT_LOGIN.");
		return;
	}
	if (req.session.role !== 2) {
		res.status(403).
			send("NOT_STUDENT.");
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT COUNT(*) FROM classusers WHERE class_id = ' + mysql.escape(req.body.class_id) +
				' AND user_id = ' + mysql.escape(req.session.user_id);
			return doSqlQuery(conn, sql);	// 检查是否重复加入
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results[0]['COUNT(*)'] !== 0) {
				conn.end();
				return Promise.reject("ALREADY_IN.");
			}
			let sql = `SELECT * FROM blacklisting WHERE class_id = ${mysql.escape(req.body.class_id)} AND ` +
				`user_id = ${mysql.escape(req.session.user_id)};`;	// 检查是否在黑名单里
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			if (sql_res.results.length > 0) {	// 在黑名单中，拒绝加入
				res.status(403).send("IN_BLACKLISTING.");
				conn.end();
				return;
			}
			let sql = 'INSERT INTO classusers (`class_id`,`user_id`,`role`) VALUES (' +
				mysql.escape(+req.body.class_id) + ',' + mysql.escape(+req.session.user_id) + ',' +
				mysql.escape(2) + ')';
			return doSqlQuery(conn, sql);	// 加入班级
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send('SUCCESS.');
		}).
		catch(function (sql_res) {
			res.status(403).
				send(sql_res);
		});
});

router.post('/invite/check', function (req, res, next) { //学生通过邀请码，找到对应班级
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).
			send("NOT_LOGIN.");
		return;
	}
	getConnection().
		then(function (conn) {
			let sql = 'SELECT `id`,`title` FROM classes WHERE `invitation_code` = ' +
				mysql.escape(req.body.invitation_code);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
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
			res.status(403).
				send({
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
			let { conn, sql_res } = packed;
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
			let { conn, sql_res } = packed;
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
			let { conn, sql_res } = packed;
			result.resources = [];
			for (var key in sql_res.results) {
				result.resources.push(sql_res.results[key].resource);
			}
			result.status = "SUCCESS.";
			conn.end();
			if (result.info.type === 2)
				delete result.info.invitation_code;
			res.send(JSON.stringify(result, null, 3));
		}).
		catch(function (result) {
			if (result.status === 'FAILED.')
				res.send(JSON.stringify(result, null, 3));
		});
});

router.post('/info/update', function (req, res, next) {
	logger.debug('>>>UPDATE CLASS INFO', req.body);
	let info = {
		description: req.body.info.description,
		notice: req.body.info.notice,
		title: req.body.info.title,
		type: req.body.info.type
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
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/create', function (req, res, next) { //创建新班级
	if (req.session.role !== 1 && req.session.role !== 0) {
		res.status(403).
			send('Only teacher can create a course.');
		return;
	}
	var title = req.body.title;
	var description = req.body.description;
	var notice = req.body.notice;
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
				let sql = 'INSERT INTO classes (`title`, `description`, `invitation_code`, ' +
					'`registration_date`, `type`, `notice`) VALUES (' +
					mysql.escape(title) + ',' + mysql.escape(description) + ',' +
					mysql.escape(invitation_code) + ',' + mysql.escape(new Date()) + ',' +
					mysql.escape(+req.body.type) + ',' + mysql.escape(notice) + ')';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				result.id = sql_res.results.insertId;
				result.status = 'SUCCESS.';
				logger.debug(sql_res.results);
				result.invitation_code = invitation_code;
				let sql = 'INSERT INTO `resources` (`class_id`, `resource`) VALUES ';
				for (let w in resources) {
					sql += '(' + mysql.escape(result.id) + ',' + mysql.escape(resources[w]) + '),';
				}
				sql = sql.substr(0, sql.length - 1);
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'INSERT INTO `classusers` (`class_id`,`role`,`user_id`,`registration_date`) VALUES (' +
					mysql.escape(+result.id) + ',' + mysql.escape(0) + ',' + mysql.escape(+req.session.user_id) + ',' +
					mysql.escape(new Date()) + ')';
				return doSqlQuery(conn, sql);
			}).
			// Add new live
			then(function (packed) {
				if (resources.indexOf('live') > -1) {
					let NewChannelJSON = {};
					for (let i in NewChannelTemplate) {
						NewChannelJSON[i] = NewChannelTemplate[i];
					}

					let timeStamp = Date.now().toString();
					NewChannelJSON.name = timeStamp;
					NewChannelJSON.timestamp = timeStamp;
					NewChannelJSON.sign = createSign(NewChannelJSON);

					let url = 'http://api.polyv.net/live/v2/channels';
					axios.post(url, querystring.stringify(NewChannelJSON)).then((resp) => {
						let vid = resp.data.data.channelId.toString();
						let uid = '99c8b47fe1';    // CONST
						let url = "https://open.ucpaas.com/ol/sms/sendsms";

						let params = vid + ',' + NewChannelJSON.channelPasswd;
						console.log(params);

						getConnection().
							then(function (_conn) {
								var _sql = 'SELECT phone FROM users WHERE `id` = ' + mysql.escape(+req.session.user_id);
								return doSqlQuery(_conn, _sql);
							}).
							then(function (_packed) {
								let phone_number = _packed.sql_res.results[0].phone;

								axios.post(url, {
									"sid": "55d17519129b8973ea369b5ba8f14f4d", // const
									"token": "43eee5a8cff8d6fd6f54ad612819b466", // const
									"appid": "de5779c82e844993b4f28470cf545d77", // const
									"templateid": "392980", // const
									"param": params,
									"mobile": phone_number
								}).then((resp) => {
								}).catch((err) => {
								});

								_packed.conn.end();
							}).
							catch(function (sql_res) {
							});
						let {conn, sql_res} = packed;
						let sql = 'INSERT INTO `lives` (`class`,`liveplayer_uid`,`liveplayer_vid`) VALUES (' +
							mysql.escape(+result.id) + ',' + mysql.escape(uid) + ',' + mysql.escape(vid) + ')';


						return doSqlQuery(conn, sql)
					}).then(function (packed) {
						let {conn, sql_res} = packed;
						conn.end();
						res.send(JSON.stringify(result, null, 3));
					}).catch((err) => {
						//console.log('error');
						//console.log(err);
						res.send(JSON.stringify({
							status: 'FAILED.',
							details: 'CAN NOT CREATE NEW CHANNEL.'
						}));
					});
				}
				else {
					let { conn, sql_res } = packed;
					conn.end();
					res.send(JSON.stringify(result, null, 3));
				}
			}).
			catch(function (sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			});
		/*
		then(function (packed) {
			let {conn, sql_res} = packed;
			conn.end();
			res.send(JSON.stringify(result, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
		*/
	}
});

router.post('/public/fetch', function (req, res, next) {//公开课程目录获取
	if (typeof(req.body.page_number) === 'undefined') {
		res.status(403).
			send('PAGE_NUM_NOT_DEFINED.');
		return;
	}
	if (typeof(req.body.page_size) === 'undefined') {
		req.body.page_size = 20;
		logger.warn('PAGE_SIZE_NOT_DEFINED.');
	}
	let m = (+req.body.page_number - 1) * req.body.page_size;
	let n = (+req.body.page_number) * req.body.page_size;
	let sql = 'SELECT * FROM classes WHERE type=1 LIMIT ' + m + ',' + n;
	getConnection().
		then(function (conn) {
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.status(200).
				send(JSON.stringify(sql_res, null, 3));
		});
});

router.post('/my_course/fetch', function (req, res, next) {
	if (typeof(req.body.page_number) === 'undefined') {
		res.status(403).
			send('PAGE_NUM_NOT_DEFINED.');
		return;
	}
	if (typeof(req.body.page_size) === 'undefined') {
		req.body.page_size = 20;
		logger.warn('PAGE_SIZE_NOT_DEFINED.');
		return;
	}
	if (typeof(req.session.user_id) === 'undefined') {
		res.status(403).
			send('USER_NOT_LOGIN.');
		return;
	}

	let m = (+req.body.page_number - 1) * req.body.page_size;
	let n = (+req.body.page_number) * req.body.page_size;
	let sql = '';
	if (req.session.role >= 2) {
		sql = 'SELECT classes.id, classes.title, classusers.registration_date FROM classes ' +
			'LEFT JOIN classusers ON classusers.class_id = classes.id AND role=' +
			mysql.escape(req.session.role) + ' WHERE classusers.user_id = ' +
			mysql.escape(+req.session.user_id) + ' ORDER BY classusers.registration_date DESC';
	}
	else {
		sql =
			/*
			'select cl.id, cl.title, liveplayer_vid as lvid ' +
			'from lives l, classusers cu, classes cl ' +
			'where cu.user_id = ' + mysql.escape(+req.session.user_id) + ' ' +
			'and cu.role = ' + mysql.escape(0) + ' ' +
			'and l.class = cu.class_id and cl.id = cu.class_id';
			*/
			'select cl.id, cl.title, liveplayer_vid as lvid ' +
			'from classusers cu left join lives l on l.class = cu.class_id, classes cl ' +
			'where cu.user_id = ' + mysql.escape(+req.session.user_id) + ' ' +
			'and cu.role = ' + mysql.escape(0) + ' ' +
			'and cl.id = cu.class_id';
	}
	getConnection().
		then(function (conn) {
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.status(403).
				send(JSON.stringify(sql_res));
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
			let { conn, sql_res } = packed;
			result.liveplayer_uid = sql_res.results[0].liveplayer_uid;
			result.liveplayer_vid = sql_res.results[0].liveplayer_vid;
			result.status = "SUCCESS.";
			conn.end();
			res.send(JSON.stringify(result, null, 3));
		}).
		catch(function (result) {
			if (result.status === 'FAILED.')
				res.send(JSON.stringify(result, null, 3));
		});
});

router.post('/addstudents', function (req, res, next) {
	let result = {
		status: undefined
	};
	let filepath = path.join('./public/uploads/' + req.body.filename);
	console.log(filepath);
	if (req.session.role !== 1 && req.session.role !== 0) {
		//res.status(403).send('Only teacher can add students from xlsx.');
		result.status = 'FAILED.';
		result.details = 'NOT TEACHER';
		res.send(JSON.stringify(result, null, 3));
		return;
	}
	fs.exists(filepath, function (exists) {
		if (exists) {
			var obj = xlsx.parse(filepath);//配置excel文件的路径
			var excelObj = obj[0].data;
			var studentlist = [];

			for (var i in excelObj) {
				studentlist.push(excelObj[i][0]);
			}
			var idlist = [];
			var existidlist = [];
			getConnection().
				then(function (conn) {
					let sql = "SELECT * FROM users WHERE `realname` = " + mysql.escape(studentlist[0]);
					for (var i in studentlist) {
						sql += " OR `realname` = " + mysql.escape(studentlist[i]);
					}
					return doSqlQuery(conn, sql);
				}).
				then(function (packed) {
					let { conn, sql_res } = packed;
					for (var i in sql_res.results) {
						idlist.push(sql_res.results[i].id);
					}
					let sql = "SELECT * FROM classusers WHERE `class_id` = " + req.body.class_id;
					return doSqlQuery(conn, sql);
				}).
				then(function (packed) {
					let { conn, sql_res } = packed;
					for (let ix in sql_res.results) {
						existidlist.push(sql_res.results[ix].user_id);
					}
					console.log(">>>>>>>idlist");
					console.log(idlist);
					console.log(">>>>>>>existidlist");
					console.log(existidlist);
					let sql = 'INSERT INTO classusers (`class_id`,`user_id`,`role`) VALUES ';
					for (var i in idlist) {
						if (existidlist.indexOf(idlist[i]) === -1) {
							sql +=
								'(' +
								mysql.escape(+req.body.class_id) + ',' +
								mysql.escape(+idlist[i]) + ',' +
								mysql.escape(2) +
								'), ';
						}
					}
					sql = sql.substr(0, sql.length - 2);
					console.log(sql);
					return doSqlQuery(conn, sql);
				}).
				then(function (packed) {
					let { conn, sql_res } = packed;
					console.log(sql_res);
					result.status = "SUCCESS.";
					conn.end();
					res.send(JSON.stringify(result, null, 3));
				}).
				catch(function (result) {
					if (result.status === 'FAILED.')
						res.send(JSON.stringify(result, null, 3));
				});
		}
		else {
			//res.status(403).send('Please upload a xlsx file named students.xlsx');
			result.status = 'FAILED.';
			result.details = 'NO STUDENTS FILE';
			res.send(JSON.stringify(result, null, 3));
		}
	});

});

router.post('/participants/assignTA', function (req, res, next) {
	let user_id = +req.session.user_id;
	let target_id = +req.body.user_id;
	let class_id = +req.body.class_id;
	let user_role = req.session.role;
	let target_role = undefined;
	getConnection().
		then(function (conn) {
			return checkPermission(conn, class_id, user_id);
		}).
		then(function (packed) {
			let { conn, role } = packed;
			user_role = role;
			return checkPermission(conn, class_id, target_id);
		}).
		then(function (packed) {
			let { conn, role } = packed;
			target_role = role;
			if (target_role !== 2) {
				conn.end();
				return Promise.reject({status:"FAILED.",details:"Cannot Assgin Teacher or TA as TA."});
			}
			if	(user_role !== 0) {
				conn.end();
				return Promise.reject({status:"FAILED.",details:"Not A Teacher"});
			} 
			let sql = 'UPDATE classusers SET role = 1 WHERE user_id = ' + mysql.escape(target_id) +
				' AND class_id = ' + mysql.escape(class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/participants/cancelTA', function (req, res, next) {
	let user_id = +req.session.user_id;
	let target_id = +req.body.user_id;
	let class_id = +req.body.class_id;
	let user_role = req.session.role;
	let target_role = undefined;
	getConnection().
		then(function (conn) {
			return checkPermission(conn, class_id, user_id);
		}).
		then(function (packed) {
			let { conn, role } = packed;
			user_role = role;
			return checkPermission(conn, class_id, target_id);
		}).
		then(function (packed) {
			let { conn, role } = packed;
			target_role = role;
			if (target_role !== 1) {
				conn.end();
				return Promise.reject({status:"FAILED.",details:"NOTTA."});
			}
			if	(user_role !== 0) {
				conn.end();
				return Promise.reject({status:"FAILED.",details:"Not A Teacher"});
			} 
			let sql = 'UPDATE classusers SET role = 2 WHERE user_id = ' + mysql.escape(target_id) +
				' AND class_id = ' + mysql.escape(class_id);
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			res.send(JSON.stringify(sql_res));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res));
		});
});

router.post('/cache/get', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let sql = 'SELECT * FROM `class_caches` WHERE `class_id`=' + mysql.escape(+req.body.class_id) + ' ' +
				'AND `entry`=' + mysql.escape(req.body.entry);
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

router.post('/cache/set', function(req, res, next) {
	getConnection().
		then(function(conn) {
			let current_time = new Date();
			let sql = 'DELETE FROM `class_caches` WHERE `drop_time`<'+mysql.escape(current_time);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			let sql = 'SELECT * FROM `class_caches` WHERE `class_id`=' + mysql.escape(+req.body.class_id) + ' ' +
				'AND `entry`=' + mysql.escape(req.body.entry);
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			if (sql_res.results.length === 0) {
				let create_time = new Date();
				let drop_time = new Date().add_minute(20);
				let sql = 'INSERT INTO `class_caches` (`class_id`, `entry`,`data`,`create_time`,`drop_time`) ' +
					'VALUES ('+mysql.escape(+req.body.class_id) + ',' + mysql.escape(req.body.entry) + ','+
					mysql.escape(req.body.data) + ',' + mysql.escape(create_time) + ','+mysql.escape(drop_time)+')';
				return doSqlQuery(conn, sql);
			} else {
				let drop_time = new Date().add_minute(20);
				let sql = 'UPDATE `class_caches` SET `data`=' + mysql.escape(req.body.data) +
					', `drop_time`=' + mysql.escape(drop_time) +
					' WHERE `class_id`=' + mysql.escape(+req.body.class_id) +
					' AND `entry`=' + mysql.escape(req.body.entry);
				return doSqlQuery(conn, sql);
			}
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

module.exports = router;
