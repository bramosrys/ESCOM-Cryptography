<template>
  <v-flex xs12 md6 pink accent-1>
    <v-card raised>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout align-center justify-center column>
              <v-card-title primary-title>
                <h1 class="headline mb-1 font-weight-bold">My studies</h1>
              </v-card-title>
            </v-layout>
            <v-card-text>
              <v-layout align-center justify-start column>
                <div class="subheading mb-1 font-weight-bold">{{actualSchool.title}}</div>
                <div class="subheading mb-2">{{actualSchool.description}}</div>
                <p>Started: {{actualSchool.start}}</p>
                <div class="subheading mb-1 font-weight-bold">{{previousSchool.title}}</div>
                <div class="subheading mb-2">{{previousSchool.description}}</div>
                <p>Started: {{previousSchool.start}} - Ended: {{previousSchool.end}}</p>
              </v-layout>
            </v-card-text>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</template>
<script>
  export default {
    props: ['actualSchool', 'previousSchool'],
    name: 'MyScholarCard'
  }
</script>

<style scoped>
</style>
