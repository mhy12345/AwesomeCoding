var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var doSqlQuery = require('../utils/funcs').doSqlQuery;
var getConnection = require('../utils/funcs').getConnection;
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").runtime_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('log_file');

router.post('/upload', upload.any(), function (req, res, next) {
	var user_id = req.session.user_id;
	if (user_id === undefined) {
		var response = {
			message: 'You must login first.',
			filename: ''
		};
		res.end(JSON.stringify(response));
	}
	else {
		var des_file = "./uploads/" + req.files[0].originalname;
		fs.readFile(req.files[0].path, function (err, data) {
			fs.writeFile(des_file, data, function (err) {
				if (err) {
					logger.info(err);
				}
				else {
					getConnection().
						then(function (conn) {
							let sql = 'insert into files (`user_id`,`filename`) VALUES ("' + user_id + '","' + req.files[0].originalname + '")';
							return doSqlQuery(conn, sql);
						}).
						then(function (packed) {
							let {conn, sql_res} = packed;
							var response = {};
							if (result.status === 'SUCCESS.') {
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


//https://blog.csdn.net/qq_36228442/article/details/81709272
router.use('/download', function (req, res, next) {
	var filename = req.body.filename;
	var file = './uploads/' + filename;
	res.writeHead(200, {
		'Content-Type': 'application/octet-stream',
		'Content-Disposition': 'attachment; filename=' + encodeURI(filename),
	});
	var readStream = fs.createReadStream(file);
	readStream.on('data', function (chunk) {
		res.write(chunk, 'binary');
	});
	readStream.on('end', function () {
		res.end();
	})
});

router.use('/test', function (req, res, next) {
	var path = './uploads/' + req.body.filename;
	res.download(path);
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
				logger.info("到底发生了啥？");
				res.send(JSON.stringify(sql_res, null, 3));
			}).
			catch(function(sql_res) {
				res.send(JSON.stringify(sql_res, null, 3));
			})
	}
});



router.post('/add', function(req, res, next) {
	let userid = req.body.userid;
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
	//just to be added;
});

module.exports = router;
