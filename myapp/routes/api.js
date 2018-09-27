var express = require('express');
var router = express.Router();
var get_connection = require('../utils/database');

/* GET home page. */
router.get('/show_table', function(req, res, next) {
	var sql = 'SELECT * from ' + req.query.table_name;
	var text = '>>>>> ' + sql + '<br/>';
	get_connection(function(conn) {
		conn.query(sql, function (error, results, fields) {
			if (error) {
				text += "ERROR ... " + error;
				res.send(text);
			}else {
				console.log(results);
				for (var i=0;i<results.length;i++) {
					text += JSON.stringify(results[i]) + "<br/>";
				}
				res.send(text);
			}
		});
	});
});

router.get('/do_query', function(req,res,next) {
	var sql = req.query.sql;
	get_connection(function(conn) {
		conn.query(sql, function (error, results, fields) {
			console.log("DO QUERY : "+sql);
			if (error) {
				res.send(error);
				console.log("FAILED");
			}else {
				res.send("Success.");
				console.log("SUCCESS");
			}
		});
	});

});

module.exports = router;
