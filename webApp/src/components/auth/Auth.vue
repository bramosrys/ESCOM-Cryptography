<template>
  <v-app id="auth">
    <auth-navbar @changeModalProp="changeCreateEmployeeProp"></auth-navbar>
    <v-content>
      <auth-form @changeModalProp="changeResetPasswordProp"></auth-form>
    </v-content>
    <!-- Layout crear empleado -->
    <v-layout row>
      <register-form :show="showCreateForm" @changeModalProp="changeCreateEmployeeProp"></register-form>
    </v-layout>
    <v-layout row>
      <reset-password-form :show="showResetForm" @changeModalProp="changeResetPasswordProp"></reset-password-form>
    </v-layout>
  </v-app>
</template>

<script>
  // Components
  import AuthNavbar from '@/components/auth/components/navbar'
  import AuthForm from '@/components/auth/components/form'
  import RegisterForm from '@/components/auth/components/RegisterForm'
  import ResetPasswordForm from '@/components/auth/components/ResetPassword'

  export default {
    components: {
      AuthForm,
      AuthNavbar,
      RegisterForm,
      ResetPasswordForm
    },
    data: () => ({
      drawer: null,
      showCreateForm: false,
      showResetForm: false
    }),
    methods: {
      changeCreateEmployeeProp () {
        this.showCreateForm = !this.showCreateForm
      },
      changeResetPasswordProp () {
        this.showResetForm = !this.showResetForm
      }
    },
    props: {
      source: String
    }
  }
</script>
