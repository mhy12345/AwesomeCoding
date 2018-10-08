var express = require('express');
var router = express.Router();
var get_connection = require('../utils/database');
var crypto = require('crypto');
var moment = require('moment');

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

function randomString(len) {
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
		result.status = 'SUCCESS.'
		result.results = [];
		for (var w in sql_res.results) {
			result.results.push(sql_res.results[w].resource);
		}
		sql_res.results;
		res.send(JSON.stringify(result,null,3));
	});
});

router.post('/class_info',function(req, res, next) {
	console.log(req.body);
	var sql = 'SELECT * FROM classes WHERE id = '+req.body.class_id;
	var result = {}
	do_sql_query(sql,function(sql_res) {
		if (sql_res.results.length == 0) {
			result.status = "NOT FOUND.";
			res.send(JSON.stringify(result,null,3));
		} else {
			result.status = "SUCCESS.";
			result.result = sql_res.results[0];
			res.send(JSON.stringify(result,null,3));
		}
	});
})

router.post('/create_class', function(req, res, next) { //创建新班级
	var title = req.body.name;
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
			do_sql_query('SELECT MAX(`id`) FROM classes',function(sql_res) {
				result.status = 'SUCCESS.';
				console.log(sql_res.results);
				result.id = sql_res.results[0]['MAX(`id`)'];
				result.invitation_code = invitation_code;
				var sql = 'INSERT INTO `resources` (`class_id`,`resource`) VALUES ';
				for (var w in resources) {
					sql += '('+result.id+',"'+resources[w]+'"),';
				}
				sql = sql.substr(0,sql.length-1);
				console.log(sql);
				do_sql_query(sql,function(sql_res) {
					res.send(JSON.stringify(result,null,3));
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


router.get('/login', function(req, res, next) { // 登录合法判断 返回 JSON
	var nickname = req.query.nickname;
	var password = req.query.password;
	var sql = 'SELECT * FROM users';
	resp = {
	    status: 'USER_NOT_FOUND.',
		results: {},
    };
	console.log("LOGIN QUERY", req.query);
    do_sql_query(sql, function (result) {
        for (var i = 0; i < result.results.length; i++) {
            if (nickname === result.results[i].nickname) {
                if (password === result.results[i].password) {
                    resp.status = 'SUCCESS.';
                    resp.results = result.results[i];
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
	console.log(next);
});

router.get('/register', function(req,res,next) { //注册新用户，不吐不快，这一段几乎由前端同学重写了！原先写后端的同学，你们在干吗？写出来的程序既不规范，而且居然还跑不动！
    console.log("[get]register query: ", req.query);
    var nickname = req.query.nickname;
    var password = req.query.password;
	var resp = {
        status: '',
        results: {},
    };
    // if (nickname === undefined || password === undefined) {
    //     console.log("no nickname or password");
    //     res.send(JSON.stringify(resp));
    //     return;
    // }
	var sql = 'SELECT * FROM users';
	var tag = 0;
	// console.log(nickname);
	//判重
    do_sql_query(sql, function (result) {
        // console.log(result.results);
        for (var i = 0; i < result.results.length; i++) {
            if (nickname === result.results[i].nickname) {
                tag = 1;
            }
        }
        if (tag === 1) {          // 重复注册 失败
            resp.status = "DUPLICATION_OF_REGISTRATION.";
            res.send(JSON.stringify(resp));
        }
        else {
            var values = [];
            var items = ['id', 'nickname', 'realname', 'role', 'motto', 'registration_date', 'password'];
            for (var item of items) {
                if (req.query[item] === undefined || req.query[item] === null || req.query[item] === '')
                    values.push('null');
                else
                    values.push('\'' + req.query[item] + '\'');
            }
            sql = 'insert into users values (' + values.join(',') + ')';
            console.log(sql);
            do_sql_query(sql, function (result) {
                if (result.status === 'SUCCESS.') {
                    resp.status = "SUCCESS.";              // 成功注册
                    resp.results = req.query;
                }
                else {
                    resp.status = 'FAILED.';
                    resp.details = result.details;
                }
                res.send(JSON.stringify(resp));
                console.log("[res] ",resp);
            });
        }
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



module.exports = router;

