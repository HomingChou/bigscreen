import Vue from 'vue'
import Router from 'vue-router'
import Bigscreen from '@/views/bigscreen/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Bigscreen',
      component: Bigscreen
    }
  ]
})
