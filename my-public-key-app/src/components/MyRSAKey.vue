<template>
  <v-flex xs12>
    <v-card raised>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout align-center justify-start>
              <v-card-title primary-title>
                <h1 class="headline font-weight-bold">Download my RSA Public Key</h1>
              </v-card-title>
            </v-layout>
            <v-card-text>
              <div class="subheading mb-1">You can see my public key and use it to encrypt some text and send it to me
                safely.
              </div>
            </v-card-text>
            <v-layout align-center justify-start>
              <v-btn @click="downloadPub">Download</v-btn>
              <a :href="dirname" ref="downloadKey"></a>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    props: ['dirname'],
    data () {
      return {}
    },
    name: 'MyRSAKey',
    methods: {
      downloadPub () {
        this.$refs.downloadKey.click()
      }
    }
  }
</script>

<style scoped>
</style>
