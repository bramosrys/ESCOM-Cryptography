import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/auth/Auth'
import ResetPasswordPage from '@/components/auth/components/ResetPasswordPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/resetPassword',
      name: 'ResetPassword',
      component: ResetPasswordPage
    }
  ]
})
