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
            <MycvDownload :dirname='cvLink'></MycvDownload>
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
  import MyScholarCard from '@/components/MyScholarCard'
  import MycvDownload from '@/components/MycvDownload'

  export default {
    components: {MyScholarCard, MyCV, MyPublicData, MyRSAKey, MycvDownload},
    data () {
      return {
        toolbarTitle: 'Sairi Milla - My Public RSA Key',
        myIntro: 'Computer Systems Engineer Student from Escuela Superior de Computo - IPN',
        myJobDescription: 'Backend developer at Weex.',
        dirName: 'https://drive.google.com/uc?export=download&id=1WrcZ8nTQ0csYRViEdpb3dzWS15vgsv6p',
        cvLink: '',
        actualJob: {
          title: 'Backend Developer',
          description: 'Development of RESTFUL services for consumption by Weex applications',
          start: '2017-12-04',
          end: ''
        },
        previousJob: {
          title: '',
          description: '',
          start: '',
          end: ''
        },
        actualSchool: {
          title: 'Escuela Superior de Cómputo',
          description: 'Computer Systems Engineer',
          start: '2014-06-18',
          end: ''
        },
        previousSchool: {
          title: 'CECYT No.9 Juan de Dios Bátiz.',
          description: 'Programming.',
          start: '2011-08-20',
          end: '2014-08-18'
        }
      }
    },
    name: 'App'
  }
</script>
