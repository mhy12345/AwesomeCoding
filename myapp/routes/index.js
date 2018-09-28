var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: '计蒜客-在线直播教学系统' });
});

module.exports = router;
