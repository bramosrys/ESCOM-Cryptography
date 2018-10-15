import Vue from 'vue'
import Router from 'vue-router'
import M from '@/components/MyPublicData'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'M',
      component: M
    }
  ]
})
