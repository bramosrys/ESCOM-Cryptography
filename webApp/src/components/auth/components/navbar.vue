<template>
  <v-toolbar fixed app dark color="primary">
    <v-toolbar-title>Crypto Login</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-flex md2 xs6>
      <v-text-field placeholder="Email server IP" color="white" v-model="serverIP"
                    @blur="changeEmailServerIP()"></v-text-field>
    </v-flex>
    <v-btn flat
           color="white"
           class="white--text" @click="changeCreateEmployeeProp()">
      Register
      <v-icon right>person_add</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  export default {
    props: ['show'],
    components: {},
    data () {
      return {
        serverIP: ''
      }
    },
    methods: {
      changeCreateEmployeeProp () {
        this.$emit('changeModalProp', !this.show)
      },
      changeEmailServerIP () {
        this.$emit('emailServerIP', this.serverIP)
      }
    }
  }
</script>

