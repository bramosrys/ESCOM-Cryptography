<template>
  <v-app>
    <v-toolbar
      app
      color="blue darken-4"
      dark
    >
      <v-layout align-center justify-center column>
        <v-toolbar-title color="red" xs12 md12>{{toolbarTitle}}</v-toolbar-title>
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
            <my-c-v :actualJob="actualJob" :previousJob="previousJob"></my-c-v>
            <my-scholar-card :actual-school="actualSchool" :previous-school="previousSchool"></my-scholar-card>
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
  import MyCV from '@/components/MyCV'
  import MyScholarCard from './components/MyScholarCard'

  export default {

    components: {MyScholarCard, MyCV, MyPublicData, MyRSAKey},
    data () {
      return {
        toolbarTitle: 'Brayan R R - My Public RSA Key',
        myIntro: 'Computer Systems Engineer Student from Escuela Superior de Computo - IPN',
        myJobDescription: 'Business Analyst & Technology Integration Analyst at PAYBACK Mexico, an American Express Company',
        dirName: 'https://drive.google.com/uc?export=download&id=1zl5v5DAOdK0VqPhLOMfq91w3r8Ne6ow6',
        actualJob: {
          title: 'Technology Integration Analyst',
          description: 'Implementation of new technologies and improvements for internal processes and partners.',
          start: '2017-12-04',
          end: ''
        },
        previousJob: {
          title: 'Internship in IT',
          description: 'Automation of internal processes connecting multiple areas. \n' +
            'Bringing efficiency to the job!',
          start: '2017-02-14',
          end: '2017-12-02'
        },
        actualSchool: {
          title: 'Escuela Superior de Cómputo',
          description: 'Computer Systems Engineer',
          start: '2014-06-18',
          end: ''
        },
        previousSchool: {
          title: 'CECYT No.2 Miguel Bernard P.',
          description: 'Metallurgic Technician.',
          start: '2011-08-20',
          end: '2014-08-18'
        }
      }
    },
    name: 'App'
  }
</script>
