var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;
var multer  = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

router.post('/upload', upload.any(), function(req, res, next) {
	var user_id = req.session.user_id;
	if (user_id === undefined) {
        var response = {
            message:'You must login first.',
            filename:''
        };
        res.end( JSON.stringify( response ) );
	}
	else {
        var des_file = "./uploads/" + req.files[0].originalname;
        fs.readFile( req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if( err ){
                    console.log( err );
                }
                else {
                	var sql = 'insert into files (`user_id`,`filename`) VALUES ("' +
								user_id + '","' + req.files[0].originalname + '")';
                	console.log(sql);
                	do_sql_query(sql, function (result) {
                        var response = {};
                		if (result.status === 'SUCCESS.') {
                			response.message = 'File uploaded successfully';
                			response.filename = req.files[0].originalname;
                            res.end( JSON.stringify( response ) );
						}
                        else {
                            response.message = 'File uploaded unsuccessfully';
                            response.filename = '';
                            res.end( JSON.stringify( response ) );
						}
                    });
                }
            });
        });
	}
});




//https://blog.csdn.net/qq_36228442/article/details/81709272
router.use('/download', function (req, res, next) {
    var filename = req.body.filename;
    var file = './uploads/' + filename;
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + encodeURI(filename),
    });
    var readStream = fs.createReadStream(file);
    readStream.on('data', function (chunk) {
        res.write(chunk, 'binary');
    });
    readStream.on('end', function () {
        res.end();
    })
});

router.use('/test', function (req, res, next) {
    var path = './uploads/' + req.body.filename;
    res.download(path);
});


router.post('/fetch', function(req, res, next) {
    var user_id = req.session.user_id;
    if (user_id === undefined) {
        var response = {
            message:'You must login first.',
        };
        res.end( JSON.stringify( response ) );
    }
    else {
        var sql = 'select * from files where user_id = ' + user_id;
        console.log(sql);
        do_sql_query(sql, function(result) {
            console.log(result);
            res.send(JSON.stringify(result,null,3));
        });
    }
});





module.exports = router;
