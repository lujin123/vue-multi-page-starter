import Vue from 'vue'
import hello from './hello.vue'

new Vue({
  render: h => h(hello)
}).$mount('#app')
