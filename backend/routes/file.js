var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');
var path = require('path');
var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
var logger = log4js.getLogger('log_file');
var mysql = require('mysql');

log4js.configure(log4js_config);

router.post('/upload', upload.any(), function (req, res, next) { //区分文件名(用空格)，禁止上传含有空格的文件
	var user_id = req.session.user_id;
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

	if (user_id === undefined) {
		response = {
			message: 'You must login first.',
			filename: ''
		};
		res.end(JSON.stringify(response));
	}
	else {
		let registration_date = mysql.escape(new Date());
		let filename = registration_date + " " + req.files[0].originalname;

		var des_file = "./uploads/" + filename;
		fs.readFile(req.files[0].path, function (err, data) {
			fs.writeFile(des_file, data, function (err) {
				if (err) {
					logger.info(err);
				}
				else {
					getConnection().
						then(function (conn) {
							let sql = 'insert into files (`user_id`,`filename`) VALUES ("' + user_id + '","' + filename + '")';
							return doSqlQuery(conn, sql);
						}).
						then(function (packed) {
							let {conn, sql_res} = packed;
							var response = {};
							if (sql_res.status === 'SUCCESS.') {
								response.message = 'File uploaded successfully';
								response.filename = req.files[0].originalname;
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
	}
});




router.get('/download', function (req, res, next) {
	var filename = req.query.filename;
	var filepath = path.join(__dirname, '../uploads/' + filename);
	var stats = fs.statSync(filepath);
	if (stats.isFile()) {
		res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename=' + filename.split(" ")[2],
			"Content-Length": stats.size
		});
		fs.createReadStream(filepath).pipe(res);
	} else {
		res.end(404);
	}
});

router.get('/get_pdf_url', function (req, res, next) {
	var filename = req.query.filename;
	var respnose = {};
	var filepath = path.join(__dirname, '../uploads/' + filename);
	var stats = fs.statSync(filepath);
	if (stats.isFile() && filename.find(".pdf") > 0) {
		respnose.filepath = filepath;
		res.send(respnose);
	} else {
		res.end(404);
	}
});




router.post('/fetch', function (req, res, next) {
	let user_id = req.session.user_id;
	if (user_id === undefined) {
		var response = {
			message: 'You must login first.',
		};
		res.end(JSON.stringify(response));
	}
	else {
		getConnection().
			then(function (conn) {
				let sql = 'select * from files where user_id = ' + user_id;
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				conn.end();
				logger.info(sql_res);
				res.send(JSON.stringify(sql_res, null, 3));
			}).
			catch(function (sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			});
	}
});


router.post('/fetch_coursefiles', function (req, res, next) {
	let classid = req.body.classid;
	let userid = req.session.user_id;
	if (userid === undefined) {
		var response = {
			message: 'You must login first.',
			filename: '',
			status: 'Failed'
		};
		res.end(JSON.stringify(response));
	}
	else {
		getConnection().
			then(function(conn) {
				let sql = 'select * from coursefiles where class_id = ' + classid;
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let {conn, sql_res} = packed;
				conn.end();
				logger.info(sql_res);
				res.send(JSON.stringify(sql_res, null, 3));
			}).
			catch(function(sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			})
	}
});



router.post('/add_to_course', function(req, res, next) {
	let userid  = req.session.user_id;
	let classid = req.body.classid;
	let fileid = req.body.fileid;
	let filename = req.body.filename;
	if (userid === undefined) {
		var response = {
			message: 'You must login first.',
			filename: '',
			status: 'Failed'
		};
		res.end(JSON.stringify(response));
	}
	else {
		getConnection().
			then(function(conn) {
				let sql = 'insert into coursefiles (`class_id`,`file_id`, `filename`) VALUES ("' + classid + '","' + fileid + '","' + filename + '")';
				return doSqlQuery(conn, sql);
			}).
			then(function(packed) {
				let {conn, sql_res} = packed;
				conn.end();
				logger.info(sql_res);
				res.send(JSON.stringify(sql_res, null, 3));
			}).
			catch(function(sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			})
	}
});



router.post('/delete', function(req, res, next) {
	let id = req.body.fileId;
	let filename = req.body.filename;
	getConnection().
		then(function(conn) {
			let sql = 'delete from files where id = ' + id;
			return doSqlQuery(conn, sql);
		}).
		then(function(packed) {
			let {conn, sql_res} = packed;
			conn.end();
			logger.info(sql_res);
			var desFile= "./uploads/" + filename;
			fs.unlinkSync(desFile);
			res.send(JSON.stringify(sql_res, null, 3));
		}).
		catch(function(sql_res) {
			res.send(JSON.stringify(sql_res, null, 3));
		})
});

module.exports = router;
