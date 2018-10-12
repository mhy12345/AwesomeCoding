var express = require('express');
var router = express.Router();
var funcs = require('../utils/funcs');
var do_sql_query = funcs.do_sql_query;
var multer  = require('multer');
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

router.post('/upload', upload.any(), function(req, res, next) {
	console.log(req.files[0]);  // 上传的文件信息

	var des_file = "./uploads/" + req.files[0].originalname;
	fs.readFile(req.files[0].path, function (err, data) {
		fs.writeFile(des_file, data, function (err) {
			if(err) {
				console.log( err );
			}else {
				response = {
					message:'File uploaded successfully',
					filename:req.files[0].originalname
				};
				console.log( response );
				res.end( JSON.stringify( response ) );
			}
		});
	});
});

module.exports = router;
