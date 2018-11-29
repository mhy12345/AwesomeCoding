/* 本文件夹的其他测试都用到了 supertest-session 的，如果在 Istanbul 测试情形下，supertest-session 实例最多只能运行一次
 * 否则会出现测试覆盖率报告无法生成的奇怪现象。
 * 因此，以本文件作为所有要用到 supertest-session 的测试文件的入口，生成一个 supertest-session 实例，
 * 并把 request 接口分发给目录下的测试文件，这样就能避免出现 supertest-session 实例多于1个的情形。
 */

const request = require('./public/session_instance');
const test_developer = require('./session_test/developer.test');
const test_user = require('./session_test/user.test');
const test_class = require('./session_test/class.test');
const test_live = require('./session_test/live.test');
const test_file = require('./session_test/file.test');

describe('===All tests requiring `supertest-session`===', function () {
	// test_developer(request);
	// test_user(request);
	// test_class(request);
	// test_file(request);
	test_live(request);
});
