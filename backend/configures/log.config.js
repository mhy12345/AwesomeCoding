var runtime_configure = {
	appenders: {
		out: {type: 'stdout'},//设置是否在控制台打印日志
		info: {type: 'file', filename: './logs/info.log'},
	},
	categories: {
		default: {appenders: ['out', 'info'], level: 'info'},
	}
};

var unittest_configure = {
	appenders: {
		out: {type: 'stdout'},//设置是否在控制台打印日志
		info: {type: 'file', filename: './logs/info.log'},
	},
	categories: {
		default: {appenders: ['info'], level: 'info'},//去掉'out'。控制台不打印日志
		test_info: {appenders: ['out', 'info'], level: 'info'},      // 显示getLogger('test_info')的日志
		test_warn: {appenders: ['out', 'info'], level: 'warn'}		// 仅打印异常
	}
};
module.exports = {
	runtime_configure,
	unittest_configure
};
