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
  import randomstring from 'randomstring'
  import crypto from 'crypto'
  // import mailjet from 'node-mailjet'

  export default {
    $_veeValidate: {
      validator: 'new'
    },
    props: ['show', 'serverIP'],
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
            console.log('server ip', this.serverIP)
            if (!this.serverIP) {
              swal(
                'Error',
                'Please, configure the email server address first',
                'error'
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
                        console.log('Posting to: ', this.serverIP)
                        var eaddress = this.serverIP
                        console.log(eaddress)
                        this.$http.post(this.serverIP, {
                          to: this.email,
                          from: 'cryptocom.delivery@gmail.com',
                          subject: 'Password reset',
                          contents: `Dear Mr/Mrs, we've received an order to reset your password, if you made the request click the following link to continue resetting your password, if you don't recognize this request please reach at so we can secure your account.`,
                          link: 'http:' + eaddress[1] + ':8080/#/?showResetPage=true&email=' + this.email + '&secK=' + randomToken
                        }).then(response => {
                          swal(
                            'OK',
                            'If the email address ' + this.email + ' matches any of our registered users, you will be receiving an email to reset your password',
                            'info'
                          )
                        }).catch(error => {
                          swal(
                            'Error',
                            error.message,
                            'error'
                          )
                        })
                      })
                    })
                  })
                }
              })
            }
          }
        })
      }
    },
    mounted () {
      this.$validator.localize('es', this.dictionary)
    }
  }
</script>
