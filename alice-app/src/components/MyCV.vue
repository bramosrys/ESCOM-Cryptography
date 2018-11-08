<template>
  <v-flex xs12 md6 pink accent-1>
    <v-card raised>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout align-center justify-center column>
              <v-card-title primary-title>
                <h1 class="headline mb-1 font-weight-bold">My work experience</h1>
              </v-card-title>
            </v-layout>
            <v-card-text>
              <v-layout align-center justify-start column>
                <div class="subheading mb-1 font-weight-bold">{{actualJob.title}}</div>
                <div class="subheading mb-2">{{actualJob.description}}</div>
                <p>Started: {{actualJob.start}}</p>
                <div class="subheading mb-1 font-weight-bold">{{previousJob.title}}</div>
                <div class="subheading mb-2">{{previousJob.description}}</div>
                <p>Started: {{previousJob.start}} - Ended: {{previousJob.end}}</p>
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
    props: ['actualJob', 'previousJob'],
    name: 'MyCV'
  }
</script>

<style scoped>
</style>
