<template>
  <v-flex xs12 pink accent-1>
    <v-card raised>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout align-center justify-center column>
              <v-avatar
                size="200"
                color="grey lighten-4"
              >
                <img src="../assets/me.jpg" alt="avatar">
              </v-avatar>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout align-center justify-center column>
              <v-card-title primary-title>
                <h1 class="headline mb-1 font-weight-bold">About Me</h1>
              </v-card-title>
            </v-layout>
            <v-card-text>
              <v-layout align-center justify-center column>
                <div class="subheading mb-1">{{myIntro}}</div>
                <div class="subheading mb-1">{{myJobDescription}}</div>
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
    props: ['myIntro', 'myJobDescription'],
    name: 'MyPublicData'
  }
</script>

<style scoped>
</style>
