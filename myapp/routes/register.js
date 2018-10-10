var express = require('express');
var router = express.Router();
var api = require("./api");
var do_sql_query = api.do_sql_query;
var mysql=require('mysql');

router.post('/', function (req, res, next) {	// 响应注册，并进行合法判断
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
            for(var value of values){
				value=mysql.escape(value);
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

module.exports = router;
