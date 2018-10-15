<template>
  <v-app>
    <v-toolbar
      app
      color="blue"
      dark
    >
      <v-layout align-center justify-center column>
        <v-toolbar-title color="red">Brayan Ramos Reyes - My Public RSA Key</v-toolbar-title>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-card>
        <v-container
          fluid
          grid-list-lg
        >
          <v-layout row wrap>
            <my-public-data :myIntro='myIntro' :myJobDescription="myJobDescription"></my-public-data>
            <my-r-s-a-key :dirname='dirName'></my-r-s-a-key>
          </v-layout>
        </v-container>
      </v-card>
    </v-content>

  </v-app>
</template>

<script>
  import MyPublicData from '@/components/MyPublicData'
  import MyRSAKey from '@/components/MyRSAKey'

  export default {

    components: {MyPublicData, MyRSAKey},
    data () {
      return {
        myIntro: 'Computer Systems Engineer Student from Escuela Superior de Computo at the IPN',
        myJobDescription: 'Business Analyst & Technology Integration Analyst at PAYBACK Mexico, an American Express Company',
        dirName: 'https://drive.google.com/uc?export=download&id=1zl5v5DAOdK0VqPhLOMfq91w3r8Ne6ow6'
      }
    },
    name: 'App'
  }
</script>
