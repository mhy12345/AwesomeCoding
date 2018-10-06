var mysql      = require('mysql');
var mysql_config = require('../configures/db_configures');

function mysql_initializer(callback) { //倘若数据库不存在，则重新新建数据库
	create_and_connect(function(conn) {
		create_class_table(conn, function(conn) {
			callback(conn);
		});
		create_class_user_table(conn, function(conn) {
			callback(conn);
		});
		create_user_table(conn, function(conn) {
			callback(conn);
		});
	});
}
function create_and_connect(callback) {
	var cfg = {
		host : mysql_config.host,
		user : mysql_config.user,
		password : mysql_config.password
	};
	var db_name = mysql_config.database;
	console.log(cfg);
	var conn = mysql.createConnection(cfg);
	conn.connect(function(err) {
		if (err) {
			console.log("Terrible Error!");
			console.log(err);
			return;
		}
		conn.query('CREATE DATABASE '+db_name,function(err) {
			if (err) {
				console.log("Terrible Error<2>!");
				console.log(err);
				return;
			}
			conn.query('USE '+db_name,function(err) {
				if (err) {
					console.log("Terrible Error<3>!");
					console.log(err);
					return;
				}
				console.log("Successfully connect to database...");
				callback(conn);
			});
		});
	});
}

function create_class_table(conn, callback) {
	var sql = "CREATE TABLE IF NOT EXISTS `classes`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+ //用于唯一标识一个班级
		"`notice` VARCHAR(80), "+ //班级公告
		"`title` VARCHAR(80) NOT NULL, "+ //班级名
		"`registration_date` DATE, "+ //注册日期
		"`password` CHAR(40), "+ //密码
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
	conn.query(sql,function (err, result) {
		if(err){
			console.log(err);
			return;
		}
		console.log("CREATE CLASS TABLE!");
		callback(conn);
	});
}

function create_class_user_table(conn, callback) { //储存每个班级中的人员信息
	var sql = "CREATE TABLE IF NOT EXISTS `classusers`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //班级id
		"`role` INT UNSIGNED NOT NULL, "+ //0表示学生，1表示助教，2表示老师
		"`userid` INT UNSIGNED NOT NULL,"+ //教师id
		"`registration_date` DATE, "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;"

	conn.query(sql,function (err, result) {
		if(err){
			console.log(err);
			return;
		}
		console.log("CREATE CLASS USER TABLE!");
		callback(conn);
	});
}



function create_user_table(conn,callback) {
	var sql = "CREATE TABLE IF NOT EXISTS `users`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+
		"`nickname` VARCHAR(40), "+
		"`realname` VARCHAR(40), "+
		"`role` INT UNSIGNED NOT NULL, "+
		"`motto` VARCHAR(200), "+
		"`registration_date` DATE, "+
		"`password` CHAR(40) NOT NULL, "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;"

	conn.query(sql,function (err, result) {
		if(err){
			console.log(err);
			return;
		}
		console.log("CREATE USER TABLE!");
		callback(conn);
	});
}

module.exports = mysql_initializer
