import UnitTest from '@/components/components/UnitTest';
import Vue from '@/../node_modules/vue';

describe('UnitTest.vue', () => {
	it('should render correct contents', () => {
		const Constructor = Vue.extend(UnitTest);
		const ListComponent = new Constructor().$mount();
		expect(ListComponent.$el.textContent).to.contain('Welcome to Your Vue.js App');
	})
});
