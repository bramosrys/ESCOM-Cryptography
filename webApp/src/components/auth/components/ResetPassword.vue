<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="850px">
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Reset password</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Please, enter the registered email address" v-model="email"
                                v-validate="'required|email'" data-vv-name="email"
                                :error-messages="errors.collect('email')"
                                v-on:keyup.enter="sendResetLink">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondaryError" flat @click.native="changeModalProp">Cancelar</v-btn>
          <v-btn color="secondary" flat @click.native="sendResetLink">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import swal from 'sweetalert2'
  import firebase from 'firebase'
  import _ from 'lodash'
  import nodemailer from 'nodemailer'
  import randomstring from 'randomstring'
  import crypto from 'crypto'

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
              required: 'The email is required',
              alpha_num: 'Solo caracteres alfanúmericos',
              email: 'Invalid email format'
            },
            password: {
              required: 'La contraseña es requerida',
              alpha_num: 'Solo caracteres alfanúmericos',
              min: 'La longitud mínima del password es 8 caracteres'
            },
            confirmPassword: {
              required: 'La confirmación de la contraseña es requerida',
              alpha_num: 'Solo caracteres alfanúmericos',
              min: 'La longitud mínima del password es 8 caracteres',
              is: 'Las contraseñas no coinciden'
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
              'Atención',
              'Algunos campos no son correctos, intentalo de nuevo',
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
              var emailExist = _.indexOf(emails, this.email)
              if (emailExist === -1) {
                // Don't send the email but warn about the possibility
                swal(
                  'OK',
                  'If the email address ' + this.email + ' matches any of our registered users, you will be receiving an email to reset your password',
                  'info'
                )
              } else {
                // Send the email with the reset link

              }
            })
          }
        })
      },
      sendResetLink () {
        this.$validator.validateAll().then(validationResult => {
          if (!validationResult) {
            // Formulario no valido
            swal(
              'Warning',
              'Enter your email address',
              'info'
            )
          } else {
            var userList = firebase.database().ref('users').orderByChild('email')
            userList.once('value').then((snapshot) => {
              var data = snapshot.val()
              var emails = _.map(data, 'email')
              var emailExist = _.indexOf(emails, this.email)
              if (emailExist === -1) {
                // Don't send the email but warn about the possibility
                swal(
                  'OK',
                  'If the email address ' + this.email + ' matches any of our registered users, you will be receiving an email to reset your password',
                  'info'
                )
              } else {
                // Send the email with the reset link
                let randomToken = randomstring.generate({length: 32, charset: 'alphabetic'})
                var dbKey = firebase.database().ref('users').orderByChild('email').equalTo(this.email).once('value')
                dbKey.then(foundNode => {
                  foundNode.forEach(node => {
                    console.log(node.val())
                    firebase.database().ref('users').child(node.key).update({
                      blockedStatus: {
                        resetHash: randomToken
                      }
                    }).then(updatedNode => {
                    })
                  })
                })
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'bramosrys@gmail.com',
                    password: 'J0b&Pr1v@t30710'
                  }
                })
                const mailOptions = {
                  from: 'bramosrys@gmail.com', // sender address
                  to: 'fania.ps25@gmail.com', // list of receivers
                  subject: 'Te amo <3', // Subject line
                  html: '<p>Haz click aquí</p>'// plain text body
                }
                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log(info)
                  }
                })
              }
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
