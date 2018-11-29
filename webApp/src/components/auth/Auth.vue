<template>
  <v-app id="auth">
    <auth-navbar @changeModalProp="changeCreateEmployeeProp" @emailServerIP="setEmailServerIp"></auth-navbar>
    <v-content>
      <auth-form @changeModalProp="changeResetPasswordProp"></auth-form>
    </v-content>
    <!-- Layout crear empleado -->
    <v-layout row>
      <register-form :show="showCreateForm" @changeModalProp="changeCreateEmployeeProp"></register-form>
    </v-layout>
    <v-layout row>
      <reset-password-form :show="showResetForm" @changeModalProp="changeResetPasswordProp" :serverIP="serverIP"></reset-password-form>
    </v-layout>
    <v-layout row>
      <reset-password-page :show="showResetPasswordPage"
                           @changeModalProp="changeResetPasswordPage"></reset-password-page>
    </v-layout>
  </v-app>
</template>

<script>
  // Components
  import AuthNavbar from '@/components/auth/components/navbar'
  import AuthForm from '@/components/auth/components/form'
  import RegisterForm from '@/components/auth/components/RegisterForm'
  import ResetPasswordForm from '@/components/auth/components/ResetPassword'
  import ResetPasswordPage from '@/components/auth/components/ResetPasswordPage'

  export default {
    components: {
      AuthForm,
      AuthNavbar,
      RegisterForm,
      ResetPasswordForm,
      ResetPasswordPage
    },
    data: () => ({
      drawer: null,
      showCreateForm: false,
      showResetForm: false,
      showResetPasswordPage: false,
      serverIP: null
    }),
    methods: {
      changeCreateEmployeeProp () {
        this.showCreateForm = !this.showCreateForm
      },
      changeResetPasswordProp () {
        this.showResetForm = !this.showResetForm
      },
      changeResetPasswordPage () {
        this.showResetPasswordPage = !this.showResetPasswordPage
      },
      setEmailServerIp (ipAddress) {
        console.log('ip changed', ipAddress)
        this.serverIP = ipAddress
      }
    },
    props: {
      source: String
    }
  }
</script>
