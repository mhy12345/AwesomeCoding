var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var async = require('async');
var get_connection = require('../utils/database');
// var loginRouter = require('./login');
// var registerRouter = require('./register');
// todo 研究如何把api模块化，现阶段的login.js register.js都是不work的 by ZFS


// router.use('/register', registerRouter);

function do_sql_query(sql, callback) {           // 执行数据库命令
    var result = {
        query: sql,
        results: [],
        status: 'SUCCESS.',
    };
    get_connection(function (conn) {
        conn.query(sql, function (error, results, fields) {
            if (error) {
                result.status = 'FAILED.';
                result.details = error;
                callback(result);
            } else {
                for (var i = 0; i < results.length; i++) {
                    result.results.push(results[i]);
                }
                callback(result);
            }
        });
    });
}

function do_sql_query_sequential(sqls, callback) {
    var result = {
        querys: sqls,
        results: [],
        status: 'SUCCESS.',
    };
    get_connection(function (conn) {
		async.eachSeries(sqls, function (item, callback) {
			console.log(item);
			conn.query(item, function (err, res) {
				console.log(res);
				callback(err, res);
			});
		}, function (err,res) {
			console.log("err: " + err);
			console.log("res: " + res);
			result.results = res;
			result.error = err;
			callback(result);
		});
    });
}

function randomString(len) {//随机生成字符串
	var $chars = 'QWERTYUIOPASDFGHJKLZXCVBNM1234567890';
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
router.get('/show_table', function(req, res, next) { //在数据库中查找表格，并打印
	var sql = 'SELECT * FROM ' + req.query.table_name;
	do_sql_query(sql, function (result) {
		res.send(JSON.stringify(result, null, 3));
	});
});

router.get('/show_columns', function(req, res, next) {
	var mysql_config = require('../configures/db_configures');
	var db_name = mysql_config.database;
	var sql = 'SELECT (COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = \''
		+ db_name + '\' AND TABLE_NAME = \'' + req.query.table_name + '\'';
    do_sql_query(sql, function (result) {
        res.send(JSON.stringify(result, null, 3));
    });
});


router.get('/do_query', function (req, res, next) { //在数据库中执行指定的SQL命令
	var sql = req.query.sql;
	do_sql_query(sql, function (result) {
		res.send(JSON.stringify(result, null, 3));
	});
});


router.post('/login', function (req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
    console.log("[post] login\n", req.body);
    var sql = 'SELECT * FROM users';
    var resp = {
        status: 'USER_NOT_FOUND.',
        results: {},
    };
    do_sql_query(sql, function (result) {
        for (var user of result.results) {
            if (req.body.nickname === user.nickname) {
                if (req.body.password === user.password) {
                    resp.status = 'SUCCESS.';
                    resp.results = user;
                    req.session.islogin = true;
                    req.session.nickname = user.nickname;
                    req.session.realname = user.realname;
                    break;
                }
                else {
                    resp.status = 'WRONG_PASSWORD.';
                    break;
                }
            }
        }
        console.log(resp);
        res.send(JSON.stringify(resp));
    });
    // console.log(next);
});

router.get('/login/is_login', function (req, res, next) {
    console.log('[get] is login\n', req.body);
    var resp = {};
    if (req.session.islogin === true) {
        console.log('login!');
        resp = req.session;
    }
    else {
        console.log('not login!');
        resp.islogin = false;
    }
    res.send(JSON.stringify(resp));
});

router.post('/register', function (req, res, next) {	// 响应注册，并进行合法判断
    console.log("[post] register\n", req.body);
    var resp = {
        status: '',
        results: {},
    };
    var sql = 'SELECT * FROM users';
    var found = false;
    //判重
    do_sql_query(sql, function (result) {
        for (var user of result.results) {
            if (req.body.nickname === user.nickname) {
                found = true;
                break;
            }
        }
        if (found) {          // 重复注册 失败
            resp.status = "DUPLICATION_OF_REGISTRATION.";
            res.send(JSON.stringify(resp));
        }
        else {
            var values = [];
            var items = ['id', 'nickname', 'realname', 'role', 'motto', 'registration_date', 'password'];
            for (var item of items) {
                if (req.body[item] === undefined || req.body[item] === null || req.body[item] === '')
                    values.push('null');
                else
                    values.push('\'' + req.body[item] + '\'');
            }
            var sql = 'insert into users values (' + values.join(',') + ')';
            // console.log(sql);
            do_sql_query(sql, function (result) {
                if (result.status === 'SUCCESS.') {
                    resp.status = "SUCCESS.";              // 成功注册
                    resp.results = req.body;
                }
                else {
                    resp.status = 'FAILED.';
                    resp.details = result.details;
                }
                res.send(JSON.stringify(resp));
                console.log("[res] ", resp);
            });
        }
    });
});

router.get('/delete_class', function(req, res, next) { //根据id删除班级
	var id = req.query.id;
	var sql = 'DELETE FROM classes WHERE id = ' + id;
	do_sql_query(sql,function(result) {
		res.send(JSON.stringify(result,null,3));
	});
	sql = 'DELETE FROM classusers WHERE id = ' + id;
	do_sql_query(sql,function(result) {
		//to do more,设计更好的适合前段解析的返回
	});
});

router.post('/class_resources', function(req, res, next) {
	var sql = 'SELECT resource FROM resources WHERE `class_id` = '+req.body.class_id;
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

router.post('/class_info/query',function(req, res, next) {
	console.log('>>>QUERY CLASS INFO',req.body);
	var sql = 'SELECT * FROM classes WHERE id = '+req.body.class_id;
	var result = {};
	do_sql_query(sql,function(sql_res) {
		if (sql_res.results.length === 0) {
			result.status = "NOT FOUND.";
			res.send(JSON.stringify(result,null,3));
		} else {
			result.info = sql_res.results[0];
			var sql = 'SELECT resource from resources WHERE class_id = '+req.body.class_id;
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

router.post('/class_info/update', function(req, res, next) {
	console.log('>>>UPDATE CLASS INFO',req.body);
	var info = req.body.info;
	var resources = req.body.resources;
	var sqls = [];
	var sql = 'UPDATE classes SET ';
	for (var key in info) {
		sql += key + '=';
		if (typeof(info[key]) == 'string')
			sql += '"' + info[key] + '"';
		else
			sql += info[key];
		sql += ',';
	}
	sql = sql.substr(0,sql.length-1);
	sql += ' WHERE id = '+req.body.class_id;
	sqls.push(sql);
	sql = 'DELETE  FROM resources WHERE class_id = '+req.body.class_id;
	sqls.push(sql);
	sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
	for (var w in resources) {
		sql += '('+req.body.class_id+',"'+resources[w]+'"),';
	}
	sql = sql.substr(0,sql.length-1);
	sqls.push(sql);
	console.log(sqls);
	do_sql_query_sequential(sqls,function(sql_res) {
		console.log(sql_res);
		res.send(JSON.stringify(sql_res));
	});
});

router.post('/create_class', function(req, res, next) { //创建新班级
	var title = req.body.title;
	var description = req.body.description;
	var invitation_code = randomString(20);
	var registration_date = moment().format('YYYY-MM-DD HH-mm-ss');
	var resources = req.body['resources[]'];
	if (typeof(resources) === 'string') {
		resources = [resources];
	}
	var result = {};
	if (title === undefined || title.length < 3) {
		result.status = 'FAILED.';
		result.details = 'WRONG TITLE.';
		res.send(JSON.stringify(result));
		console.log("ERROR CREATING CLASS");
	} else {
		var sql = 'INSERT INTO classes (`title`,`description`,`invitation_code`,`registration_date`) VALUES ("' + title + '","' +description+'","'+invitation_code+'","'+registration_date + '")';
		console.log(sql);
		do_sql_query(sql,function(sql_res) {
            do_sql_query('SELECT MAX(`id`) FROM classes', function (sql_res) {
                result.status = 'SUCCESS.';
                console.log(sql_res.results);
                result.id = sql_res.results[0]['MAX(`id`)'];
                result.invitation_code = invitation_code;
                var sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
                for (var w in resources) {
                    sql += '(' + result.id + ',"' + resources[w] + '"),';
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
router.post('/get_classes_list', function(req, res, next) {
	var m = (req.query.m === undefined? null: req.query.m); //从第几条开始取
	var n = (req.query.n === undefined? null: req.query.n);
	var sql = 'SELECT * FROM classes LIMIT ' + m + ',' + n;
	console.log(sql);
	do_sql_query(sql,function(result) {
		res.send(JSON.stringify(result,null,3));
	});
});


var multer  = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

router.post('/upload', upload.any(), function(req, res, next) {
	console.log(req.files[0]);  // 上传的文件信息

	var des_file = "./uploads/" + req.files[0].originalname;
	fs.readFile( req.files[0].path, function (err, data) {
		fs.writeFile(des_file, data, function (err) {
			if( err ){
				console.log( err );
			}else{
				response = {
					message:'File uploaded successfully',
					filename:req.files[0].originalname
				};
				console.log( response );
				res.end( JSON.stringify( response ) );
			}
		});
	});
});

exports.router = router;
exports.do_sql_query = do_sql_query;
// module.exports = router;
