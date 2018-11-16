<template>
  <v-app id="auth">
    <auth-navbar @changeModalProp="changeCreateEmployeeProp"></auth-navbar>
    <v-content>
      <auth-form></auth-form>
    </v-content>
    <!-- Layout crear empleado -->
    <v-layout row>
      <register-form :show="showCreateForm" @changeModalProp="changeCreateEmployeeProp"></register-form>
    </v-layout>
  </v-app>
</template>

<script>
// Components
  import AuthNavbar from '@/components/auth/components/navbar'
  import AuthForm from '@/components/auth/components/form'
  import RegisterForm from '@/components/auth/components/RegisterForm'

  export default {
    components: {
      AuthForm,
      AuthNavbar,
      RegisterForm
    },
    data: () => ({
      drawer: null,
      showCreateForm: false
    }),
    methods: {
      changeCreateEmployeeProp () {
        this.showCreateForm = !this.showCreateForm
      }
    },
    props: {
      source: String
    }
  }
</script>
