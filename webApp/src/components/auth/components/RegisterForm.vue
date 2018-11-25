<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="850px">
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Register user</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Email*" v-model="email"
                                v-validate="'required|email'" data-vv-name="email"
                                :error-messages="errors.collect('email')">
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Password*" v-model="password"
                                v-validate="'required|alpha_num|min:8|max:32'" data-vv-name="password"
                                :error-messages="errors.collect('password')"
                                :append-icon="hiddenPassword ? 'visibility' : 'visibility_off'"
                                @click:append="() => (hiddenPassword = !hiddenPassword)"
                                :type="hiddenPassword ? 'password' : 'text'">
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Repeat password*" v-model="confirmPassword"
                                v-validate="{required:true,alpha_num:true,min:8,max:32,is:password}"
                                data-vv-name="confirmPassword"
                                :error-messages="errors.collect('confirmPassword')"
                                :append-icon="hiddenPassword ? 'visibility' : 'visibility_off'"
                                @click:append="() => (hiddenPassword = !hiddenPassword)"
                                :type="hiddenPassword ? 'password' : 'text'"
                                v-on:keyup.enter="login">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondaryError" flat @click.native="changeModalProp">Cancelar</v-btn>
          <v-btn color="secondary" flat @click.native="createUser()">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
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
    props: ['show'],
    created () {
    },
    data () {
      return {
        form: null,
        email: null,
        password: null,
        confirmPassword: null,
        hiddenPassword: true,
        dictionary: {
          custom: {
            email: {
              required: 'El email es requerido',
              alpha_num: 'Solo caracteres alfanúmericos',
              email: 'El email ingresado no es válido'
            },
            password: {
              required: 'The password is required',
              alpha_num: 'Solo caracteres alfanúmericos',
              min: 'Mininum password lenght is 8 chars'
            },
            confirmPassword: {
              required: 'The password confirmation is required',
              alpha_num: 'Solo caracteres alfanúmericos',
              min: 'Mininum password lenght is 8 chars',
              is: `Passwords doesn't match`
            }
          }
        }
      }
    },
    methods: {
      changeModalProp () {
        this.$validator.reset()
        this.$emit('changeModalProp', !this.show)
      },
      clearData () {
        this.$validator.reset()
        this.form = null
        this.email = null
        this.password = null
        this.confirmPassword = null
      },
      createUser () {
        this.$validator.validateAll().then(validationResult => {
          if (!validationResult) {
            // Formulario no valido
            swal(
              'Warning',
              'Missing fields',
              'info'
            )
          } else {
            var userList = firebase.database().ref('users').orderByChild('email')
            userList.once('value').then((snapshot) => {
              var data = snapshot.val()
              var emailExist = _.indexOf(_.map(data, 'email'), this.email.replace(/\s+/g, '').toLowerCase())
              if (emailExist >= 0) {
                swal(
                  'Atencion',
                  'El email ya está en uso',
                  'info'
                )
              } else {
                var hash = crypto.createHash('sha256').update(this.password).digest('base64')
                console.log('El pass sin hash es:', this.password)
                console.log('La hash es:', hash)
                var dbKey = firebase.database().ref().child('users').push().key
                var newUser = {}
                newUser['users/' + dbKey] = {
                  email: this.email.replace(/\s+/g, '').toLowerCase(),
                  password: hash,
                  blockedStatus: {
                    resetHash: '' // randomstring.generate({length: 32, charset: 'alphabetic'})
                  }
                }
                firebase.database().ref().update(newUser).then((data) => {
                  swal(
                    'OK',
                    'El registro fue exitoso',
                    'success'
                  )
                }).catch(err => {
                  console.log(err)
                  swal(
                    'Error',
                    'Ocurrió un error al procesar tu respuesta.',
                    'error'
                  )
                })
              }
            }).catch(error => {
              console.log(error)
            })
          }
        })
      }
    },
    mounted () {
      this.$validator.localize('es', this.dictionary)
    }
  }
</script>
