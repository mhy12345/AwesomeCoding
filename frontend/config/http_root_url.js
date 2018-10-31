// for 本地 npm run server 测试，注意要开启 allow control 插件
var host = require('../../backend/configures/server.config');
var root_url = 'http://' + host.ip + ':' + host.port;

// todo   for 最终发布版本/npm run build 测试
// var root_url = 'http://localhost';


module.exports = root_url;
