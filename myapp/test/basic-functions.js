const assert = require('assert');
const randomString = require('../utils/funcs').randomString;

describe('#basic-functions', () => {
	describe('#randomString()', () => {
		it('The length of the results should be correct.', () => {
			assert.strictEqual(randomString(10).length, 10);
		});
	});
});
