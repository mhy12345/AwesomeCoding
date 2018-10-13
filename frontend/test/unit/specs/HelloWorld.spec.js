import Vue from 'vue'
import UnitTest from '@/components/components/UnitTest'

describe('UnitTest.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(UnitTest)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
