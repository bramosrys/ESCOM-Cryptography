<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" card dark>
            <v-toolbar-title>Welcome</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" v-model="user"
                            v-validate="'required'"
                            data-vv-name="username"
                            :error-messages="errors.collect('username')">
              </v-text-field>
              <v-text-field label="Password" v-model="password"
                            :append-icon="hiddenPassword ? 'visibility' : 'visibility_off'"
                            @click:append="() => (hiddenPassword = !hiddenPassword)"
                            :type="hiddenPassword ? 'password' : 'text'"
                            v-validate="'required'"
                            data-vv-name="password"
                            :error-messages="errors.collect('password')"
                            v-on:keyup.enter="login">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="primary" @click="resetPassword">Forgot your password?</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import swal from 'sweetalert2'
  import firebase from 'firebase'
  import _ from 'lodash'

  var crypto = require('crypto')

  export default {
    $_veeValidate: {
      validator: 'new'
    },
    data () {
      return {
        user: null,
        password: null,
        hiddenPassword: true,
        dictionary: {
          attributes: {
            username: 'Email',
            password: 'Contraseña'
          },
          custom: {
            username: {
              required: 'The email is required',
              alpha: 'Solo caracteres alfanumericos'
            },
            password: {
              required: 'The password is required'
            }
          }
        }
      }
    },
    methods: {
      login () {
        this.$validator.validate().then(result => {
          if (!result) {
            // Formulario no valido
            swal(
              'Warning',
              'Missing fields',
              'info'
            )
          } else {
            // Formulario valido
            var hash = crypto.createHash('sha256').update(this.password).digest('base64')
            console.log('La hash es:', hash)
            var userList = firebase.database().ref('users').orderByChild('email')
            userList.once('value').then((snapshot) => {
              var data = snapshot.val()
              var emails = _.map(data, 'email')
              var passwords = _.map(data, 'password')
              var emailExist = _.indexOf(emails, this.user)
              if (emailExist === -1) {
                swal(
                  'Warning',
                  'Wrong credentials',
                  'error'
                )
              } else {
                if (passwords[emailExist] !== hash) {
                  swal(
                    'Warning',
                    'Wrong credentials',
                    'error'
                  )
                } else {
                  swal(
                    'Welcome',
                    'Nice to say hi today :)',
                    'success'
                  )
                }
              }
            })
          }
        })
      },
      resetPassword () {
        this.$emit('changeModalProp')
      }
    },
    mounted () {
      this.$validator.localize('es', this.dictionary)
    }
  }
</script>
