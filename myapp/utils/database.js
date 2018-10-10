var mysql      	 = require('mysql');
var mysql_config = require('../configures/db_configures');
var mysql_init   = require('./mysql_initializer');

function get_connection(callback) { //获取连接connection，并调用回调函数
	return new Promise(function(resolve,reject) {
		console.log("CREATING CONNECTION ... <",mysql_config,">");
		connection = mysql.createConnection(mysql_config);
		connection.connect(function (err) {
			console.log("2<<<",err);
			if (err) {
				if (err.code === 'ER_BAD_DB_ERROR') {
					console.log("BAD DATABASE!");
					connection.end();
					mysql_init().then(function(conn) {
						resolve(conn);
					},function(err) {
						reject(err);
					});
					return;
				}
				else {
					console.log("UNPREDICTED ERROR!");
					connection.end();
					mysql_init().then(function(conn) {
						resolve(conn);
					},function(err) {
						reject(err);
					});
					return;
				}
			}
			resolve(connection);
		});
	});
}

module.exports = get_connection;
