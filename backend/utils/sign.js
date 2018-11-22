var appSecret = '9769ac120b044ade994559ca72d14169';

function getSign(Params) {
	let arr = [];
	for(let i in Params) {
		arr.push(i);
	}
	arr.sort();

	let str = appSecret;
	for(let i = 0; i < arr.length; i ++) {
		str = str + arr[i] + Params[arr[i]];
	}
	str = str + appSecret;

	var md5 = require('md5-node');
	let md5string = md5(str);
	let ret = md5string.toUpperCase();
	return ret;
}

module.exports = {
	getSign
};
