var mysql      = require('mysql');
var mysql_config = require('../configures/db_configures');
var mysql_init = require('./mysql_initializer');

console.log(mysql_config);

var connection = mysql.createConnection(mysql_config);
connection.connect(function (err) {
	if (err) {
		if (err.code == 'ER_BAD_DB_ERROR') {
			console.log("BAD DATABASE!");
			mysql_init(mysql_config);
		}
	}
	console.log("Successfully connect to database...");
});

module.exports = connection
