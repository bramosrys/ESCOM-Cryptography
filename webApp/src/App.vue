<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data () {
      return {}
    },
    beforeCreate () {
      var config = {
        apiKey: 'AIzaSyCPpcfT7ILIR36PogmjiN3zWFOeDll8liE',
        authDomain: 'cryptologin-d0ed3.firebaseapp.com',
        databaseURL: 'https://cryptologin-d0ed3.firebaseio.com',
        projectId: 'cryptologin-d0ed3',
        storageBucket: '',
        messagingSenderId: '412975394917'
      }
      firebase.initializeApp(config)
    },
    name: 'App'
  }
</script>
