const assert = require('assert');
const randomString = require('../utils/funcs').randomString;
const getSign = require('../utils/sign').getSign;
const {notifyClassMembers,alertClassMembers} = require('../utils/socket_io');

describe('#basic-functions', () => {
	describe('#randomString()', () => {
		it('The length of the results should be correct.', () => {
			assert.strictEqual(randomString(10).length, 10);
		});
	});
	describe("#getSign()", () => {
		it('check sign with empty params', () => {
			assert.strictEqual(getSign([]),'F802241C63890D001B56F14D6D9CE0AD');
		});
	});
	describe("#socket_io", () => {
		it('empty call notify', () => {
			return notifyClassMembers( {
					emit: ()=>{},
				}
				,{
					course_id: 1
				});
		});
		it('empty call alert', () => {
			return alertClassMembers( {
					emit: ()=>{},
				}
				,{
					course_id: 1
				});
		});
	});
});
