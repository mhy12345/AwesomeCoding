require('../test-debug.js');

const should = require('should');
const assert = require('assert');
const randomString = require('../../utils/funcs').randomString;
const getConnection = require('../../utils/funcs.js').getConnection;
const doSqlQuery = require('../../utils/funcs.js').doSqlQuery;
let mysql_config = require('../../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('default');


module.exports = function (request) {

};