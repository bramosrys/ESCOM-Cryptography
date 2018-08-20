import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'WelcomeView',
            component: require('@/components/WelcomeView').default
        },
        {
            path: '/cesars',
            name: 'CesarCipher',
            component: require('@/components/Ciphers/Clasics/CesarCipher').default
        },
        {
            path: '/appendix',
            name: 'AppendixCipher',
            component: require('@/components/Ciphers/Appendix/AppendixCipher').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
