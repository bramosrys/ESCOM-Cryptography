<template>
  <v-toolbar fixed app dark color="primary">
    <v-toolbar-title>Crypto Login</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat
    color="white"
    class="white--text" @click="changeCreateEmployeeProp()">
      Registrarse
      <v-icon right>person_add</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  export default {
    props: ['show'],
    components: {
    },
    data () {
      return {
      }
    },
    methods: {
      changeCreateEmployeeProp () {
        console.log('emitiendo')
        this.$emit('changeModalProp', !this.show)
      }
    }
  }
</script>

