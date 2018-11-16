import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/auth/Auth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: Auth
    }
  ]
})
