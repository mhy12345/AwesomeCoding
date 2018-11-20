var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
var fs = require('fs');
var path = require('path');
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
var logger = log4js.getLogger('file_log');
var mysql = require('mysql');
var doSqlQuerySequential = require('../utils/funcs').doSqlQuerySequential;
const crypto = require('crypto');
log4js.configure(log4js_config);

router.use(function (req, res, next) {		// 检查登录状态
	if (req.session.user_id === undefined) {
		res.send(JSON.stringify({
			status: 'FAILED.',
			details: 'USER OFFLINE.'
		}));
	}
	else {
		next();
	}
});

router.post('/upload', upload.any(), function (req, res, next) { //区分文件名(用空格)，禁止上传含有空格的文件
	var user_id = req.session.user_id;
	var response, i;
	var hash = crypto.createHash('md5');
	for (i = 0; i < req.files[0].originalname.length; i = i + 1) {	// 命名合法性判断
		if (req.files[0].originalname[i] === ' ') {
			response = {
				message: 'Spaces do not allowed.',
				filename: ''
			};
			res.end(JSON.stringify(response));
			return;
		}
	}
	let registration_date = mysql.escape(new Date());
	hash.update(registration_date);
	let filename = hash.digest("hex") + req.files[0].originalname;

	var des_file = path.join('./public/uploads/' + filename);		// 储存路径
	fs.readFile(req.files[0].path, function (err, data) {
		fs.writeFile(des_file, data, function (err) {
			if (err) {
				logger.info(err);
			}
			else {													// 记录写入数据库
				getConnection().
					then(function (conn) {
						let sql = 'insert into files (`user_id`,`filename`) VALUES ("' + user_id + '","' + filename + '")';
						return doSqlQuery(conn, sql);
					}).
					then(function (packed) {
						let { conn, sql_res } = packed;
						var response = {};
						if (sql_res.status === 'SUCCESS.') {
							response.message = 'File uploaded successfully';
							response.filename = filename;
							response.showname = req.files[0].originalname;
							res.end(JSON.stringify(response));
						}
						else {
							response.message = 'File uploaded unsuccessfully';
							response.filename = '';
							res.end(JSON.stringify(response));
						}
					}).
					catch(function (sql_res) {
						res.send(JSON.stringify(sql_res));
					});
			}
		});
	});
});

router.post('/uploadcourseimg', upload.any(), function (req, res, next) { //区分文件名(用空格)，禁止上传含有空格的文件
	var response, i;
	for (i = 0; i < req.files[0].originalname.length; i = i + 1) {
		if (req.files[0].originalname[i] === ' ') {
			response = {
				message: 'Spaces do not allowed.',
				filename: ''
			};
			res.end(JSON.stringify(response));
			return;
		}
	}

	let registration_date = mysql.escape(new Date().getTime());
	let filename = req.body.class.toString() + "_" + registration_date + "_" + req.files[0].originalname;

	var des_file = path.join('./public/images/' + filename);
	var savedfilepath = 'images/' + filename;
	fs.readFile(req.files[0].path, function (err, data) {
		fs.writeFile(des_file, data, function (err) {
			if (err) {
				logger.info(err);
			}
			else {
				getConnection().
					then(function (conn) {
						let sql = 'update classes set imagepath = ' + mysql.escape(savedfilepath) +
							' where id = ' + mysql.escape(+req.body.class);
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
			}
		});
	});
});


router.post('/import', upload.any(), function (req, res, next) { //区分文件名(用空格)，禁止上传含有空格的文件
	var response, i;
	var hash = crypto.createHash('md5');
	for (i = 0; i < req.files[0].originalname.length; i = i + 1) {
		if (req.files[0].originalname[i] === ' ') {
			response = {
				message: 'Spaces do not allowed.',
				filename: ''
			};
			res.end(JSON.stringify(response));
			return;
		}
	}
	let registration_date = mysql.escape(new Date());
	hash.update(registration_date);
	let filename = hash.digest("hex") + req.files[0].originalname;

	var des_file = path.join('./public/uploads/' + filename);
	fs.readFile(req.files[0].path, function (err, data) {
		fs.writeFile(des_file, data, function (err) {
			if (err) {
				logger.info(err);
			} else {
				response = {};
				response.filename = filename;
				response.showname = req.files[0].originalname;
				res.end(JSON.stringify(response));
			}
		});
	});
});

router.get('/download', function (req, res, next) {
	var filename = req.query.filename;
	var filepath = path.join('./public/uploads/' + filename);
	var stats = fs.statSync(filepath);
	if (stats.isFile()) {
		res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename=' + encodeURI(filename.slice(32)),
			"Content-Length": stats.size
		});
		fs.createReadStream(filepath).pipe(res);
	} else {
		res.end(404);
	}
});


router.post('/fetch', function (req, res, next) {
	let user_id = req.session.user_id;
	getConnection().
		then(function (conn) {
			let sql = 'select * from files where user_id = ' + user_id;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			logger.info(sql_res);
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});


router.post('/fetch_coursefiles', function (req, res, next) {
	let classid = req.body.classid;
	let userid = req.session.user_id;
	getConnection().
		then(function (conn) {
			let sql = 'select * from coursefiles where class_id = ' + classid;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			logger.info(sql_res);
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});


router.post('/add_to_course', function (req, res, next) {
	let userid = req.session.user_id;
	let classid = req.body.classid;
	let fileid = req.body.fileid;
	let filename = req.body.filename;
	getConnection().
		then(function (conn) {
			let sql = 'insert into coursefiles (`class_id`,`file_id`, `filename`) VALUES ("' + classid + '","' + fileid + '","' + filename + '")';
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			logger.info(sql_res);
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});


router.post('/delete_from_course', function(req, res, next) {
	let userid  = req.session.user_id;
	let classid = req.body.classid;
	let fileid = req.body.fileid;
	getConnection().
		then(function (conn) {
			let sql = 'delete from coursefiles where class_id = ' + classid + ' and file_id = ' + fileid;
			return doSqlQuery(conn, sql);
		}).
		then(function (packed) {
			let { conn, sql_res } = packed;
			conn.end();
			logger.info(sql_res);
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function (sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});




router.post('/delete', function(req, res, next) {
	let id = req.body.fileId;
	let filename = req.body.filename;
	let sqls = [];
	let sql = 'delete from files where id = ' + id;
	sqls.push(sql);
	sql = 'delete from coursefiles where file_id = ' + id;
	sqls.push(sql);
	getConnection().
		then(function(conn) {
			return doSqlQuerySequential(conn, sqls);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			logger.info(sql_res);
			var desFile= "./public/uploads/" + filename;
			fs.unlinkSync(desFile);
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		});
});

module.exports = router;
