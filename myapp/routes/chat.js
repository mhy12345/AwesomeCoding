var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;

router.get('/ban', function(req,res,next) { //添加禁言名单
    var userid = req.query.userid;
    var classid = req.query.classid;
    var status = req.query.status;

    var sql = 'select * from bannedlist where userid = ' + userid + ' and classid = ' + classid;
    var tag = 0;
    var resp = {
        status: '',
        results: {},
    };
    do_sql_query(sql, function (result) {
        if (result.results.length > 0) tag = 1;
        if (tag === 1) {
            var id = result.results[0].id;
            sql = 'update bannedlist set status = ' + status + ' where id = ' + id;
        } else {
            sql = 'insert into bannedlist (`userid`,`classid`,`status`) VALUES ("' +
                userid + '","' + classid + '","' + status + '")';
        }
        do_sql_query(sql, function (result) {
            console.log(sql);
            if (result.status === 'SUCCESS.') {
                resp.status = "SUCCESS.";              // 成功注册
                resp.results = req.query;
            } else {
                resp.status = 'FAILED.';
                resp.details = result.details;
            }
            res.send(JSON.stringify(resp));
            console.log("[res] ",resp);
        });
    });
});


router.get('/add_comments', function(req,res,next) {
    var userid = req.body.userid;
    var classid = req.body.classid;
    var message = req.body.message;

    var registration_date = moment().format('YYYY-MM-DD HH-mm-ss');

    var resp = {};
    if (userid === undefined || classid === undefined || message.length > 200) {
        resp.status = 'FAILED.';
        resp.details = 'ILLEGAL INPUT.';
        res.send(JSON.stringify(resp));
        console.log("ERROR WHILING ADDING A COMMENT");
    } else {
        //被禁言
        var sql = 'select * from bannedlist where userid = ' + userid + ' and classid = ' + classid;
        do_sql_query(sql, function (result) {
            if (result.results.length > 0 && result.results[0].status === 0) {
                resp.status = 'FAILED.';
                resp.details = 'STILL IN BLACKLIST.';
                res.send(JSON.stringify(resp));
                console.log("FORBID");
            } else {
                sql = 'insert into forums (`userid`,`classid`,`message`,`registration_date`) VALUES ("' +
                    userid + '","' + classid + '","' + message + '","' + registration_date + '")';
                console.log(sql);
                do_sql_query(sql, function(result) {
                    if (result.status === 'SUCCESS.') {
                        resp.status = "SUCCESS.";              // 成功注册
                        resp.results = req.query;
                    } else {
                        resp.status = 'FAILED.';
                        resp.details = result.details;
                    }
                    res.send(JSON.stringify(resp));
                    console.log("[res] ",resp);
                });
            }
        });
    }
});

module.exports = router;
