var express = require('express');
var router = express.Router();
var api = require("./api");
var do_sql_query = api.do_sql_query;

router.post('/', function (req, res, next) {  // 响应登录，并进行合法判断 返回 JSON
    console.log("[post] login\n", req.body);
    var sql = 'SELECT * FROM users';
    var resp = {
        status: 'USER_NOT_FOUND.',
        results: {},
    };
    do_sql_query(sql, function (result) {
        console.log('????');
        for (var user of result.results) {
            if (req.body.nickname === user.nickname) {
                if (req.body.password === user.password) {
                    resp.status = 'SUCCESS.';
                    resp.results = user;
                    req.session.islogin = true;
                    req.session.nickname = req.body.nickname;
                    req.session.realname = req.body.realname;
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

router.get('/is_login', function (req, res, next) {
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

module.exports = router;
