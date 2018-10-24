var mysql = require('mysql');
var mysql_config = require('../configures/db_configures');
var async = require('async');

var db_debugger = require('debug')("database");

var sqls = {
	'create_file_table' : "CREATE TABLE IF NOT EXISTS `files`(" + //文件表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`user_id` INT UNSIGNED NOT NULL, " +
		"`filename` VARCHAR(100), " +
		"`type` CHAR(20), " +
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

	'create_class_resources' : "CREATE TABLE IF NOT EXISTS `resources`(" + //班级教学资源表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`class_id` INT UNSIGNED NOT NULL, " +
		"`resource` CHAR(20), " +
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

	'create_class_table' : "CREATE TABLE IF NOT EXISTS `classes`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+ //用于唯一标识一个班级
		"`description` VARCHAR(500), " +
		"`notice` VARCHAR(500), "+ //班级公告
		"`title` VARCHAR(80) NOT NULL, "+ //班级名
		"`registration_date` TIMESTAMP, "+ //注册日期
		"`invitation_code` CHAR(40), "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

	'create_class_user_table' : "CREATE TABLE IF NOT EXISTS `classusers`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //班级id
		"`role` INT UNSIGNED NOT NULL, "+ //0表示学生，1表示助教，2表示老师
		"`userid` INT UNSIGNED NOT NULL,"+ //教室id
		"`registration_date` TIMESTAMP, "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_user_table' : "CREATE TABLE IF NOT EXISTS `users`(" + //用户表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+
		"`email` CHAR(30) NOT NULL,"+
		"`nickname` VARCHAR(40), "+
		"`realname` VARCHAR(40), "+
		"`role` INT UNSIGNED NOT NULL, "+
		"`motto` VARCHAR(200), "+
		"`registration_date` TIMESTAMP, "+
		"`password` CHAR(40) NOT NULL, "+
		"PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

    'create_banned_list': "CREATE TABLE IF NOT EXISTS `bannedlist`(" + //禁言列表，关联房间和使用者
        "`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+
        "`userid` INT UNSIGNED NOT NULL, "+
        "`classid` INT UNSIGNED NOT NULL, "+
        "`status` INT UNSIGNED NOT NULL, "+ //0代表禁言状态，1代表解除状态
        "PRIMARY KEY (`id`) "+
        ")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

    'create_forums' : "CREATE TABLE IF NOT EXISTS `forums`(" +
        "`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+ //消息id
        "`userid` INT UNSIGNED NOT NULL, "+ //发言者id
        "`classid` INT UNSIGNED NOT NULL, "+ //讨论区位置id
        "`message` VARCHAR(200), " + //发言内容
        "`registration_date` TIMESTAMP, "+
        "PRIMARY KEY (`id`) "+
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,
		
	'create_posts' : "CREATE TABLE IF NOT EXISTS `posts`(" +
        "`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, "+ //消息id
        "`userid` INT UNSIGNED NOT NULL, "+ //发言者id
        "`forumid` INT UNSIGNED NOT NULL, "+ //属于哪个主题贴
        "`message` VARCHAR(200), " + //发言内容
        "`registration_date` TIMESTAMP, "+
        "PRIMARY KEY (`id`) "+
        ")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,
	'create_database' : 'CREATE DATABASE ' + mysql_config.database,
	'use_database' : 'USE ' + mysql_config.database,
}

function mysql_initializer() { //倘若数据库不存在，则重新新建数据库
	return new Promise(function(resolve,reject) {
		let cfg = {
			host : mysql_config.host,
			user : mysql_config.user,
			password : mysql_config.password
		};
		sqls['create_database'] = 'CREATE DATABASE ' + mysql_config.database;
		sqls['use_database'] ='USE ' + mysql_config.database;
		db_debugger(cfg);
		let conn = mysql.createConnection(cfg);
		conn.connect(function(err) {
			if (err) {
				reject({
					status : 'FAILED.',
					details : err
				});
				return ;
			}
			var tasks = ['create_database', 'use_database', 'create_user_table', 'create_class_table', 'create_class_user_table', 'create_class_resources', 'create_forums', 'create_file_table','create_banned_list','create_posts',];
			async.eachSeries(tasks, function (item, next) {
				db_debugger(item + " ==> " + sqls[item]);
				conn.query(sqls[item], function (err, res) {
					if (err) {
						next({
							status: 'FAILED.',
							details: err
						},null);
						return;
					}
					next(null, res);
				});
			}, function (err,res) {
				if (err)
					reject(err);
				else
					resolve(conn);
			});
		});
	});
}

module.exports = mysql_initializer
