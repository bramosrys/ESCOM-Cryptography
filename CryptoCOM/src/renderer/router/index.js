import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/AESRSADigitalSign',
      name: 'AESRSADigitalSign',
      component: require('@/components/Ciphers/Moderns/AESRSADigitalSign').default
    },
    {
      path: '/',
      name: 'WelcomeView',
      component: require('@/components/WelcomeView').default
    },
    {
      path: '/appendix',
      name: 'AppendixCipher',
      component: require('@/components/Ciphers/Appendix/AppendixCipher').default
    },
    {
      path: '/caesars',
      name: 'CesarCipher',
      component: require('@/components/Ciphers/Clasics/CaesarCipher').default
    },
    {
      path: '/affine',
      name: 'AffineCipher',
      component: require('@/components/Ciphers/Clasics/AffineCipher').default
    },
    {
      path: '/euclideanAffine',
      name: 'EuclidAffineCipher',
      component: require('@/components/Ciphers/Clasics/AffineEuclid').default
    },
    {
      path: '/bmpCipher',
      name: 'BitmapDesAes',
      component: require('@/components/Ciphers/Moderns/BitmapDesAes').default
    },
    {
      path: '/RSAPubPriKey',
      name: 'RSAPubPriKey',
      component: require('@/components/Ciphers/Moderns/RSAPubPriKey').default
    },


    {
      path: '*',
      redirect: '/'
    }
  ]
})
