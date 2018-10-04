var mysql      	 = require('mysql');
var mysql_config = require('../configures/db_configures');
var mysql_init   = require('./mysql_initializer');

function get_connection(callback) { //获取连接connection，并调用回调函数
    console.log(mysql_config);
    connection = mysql.createConnection(mysql_config);
    connection.connect(function (err) {
        if (err) {
            if (err.code == 'ER_BAD_DB_ERROR') {
                console.log("BAD DATABASE!");
                mysql_init(callback);
                return;
            }
            else {
                console.log("UNPREDICTED ERROR!");
                mysql_init(callback);
                return;
            }
        }
        console.log("Successfully connect to database...");
        callback(connection);
    });
}

module.exports = get_connection;
