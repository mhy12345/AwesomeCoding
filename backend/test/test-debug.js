let log4js_config = require('../configures/log.config.js');

log4js_config.runtime_configure.categories.default.level = 'warn';
log4js_config.database_configure.categories.default.level = 'warn';
log4js_config.unittest_configure.categories.default.level = 'warn';
