<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="850px">
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Please write your new password</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
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
                  <v-text-field label="Password confirmation*" v-model="confirmPassword"
                                v-validate="{required:true,alpha_num:true,min:8,max:32,is:password}"
                                data-vv-name="confirmPassword"
                                :error-messages="errors.collect('confirmPassword')"
                                :append-icon="hiddenPassword ? 'visibility' : 'visibility_off'"
                                @click:append="() => (hiddenPassword = !hiddenPassword)"
                                :type="hiddenPassword ? 'password' : 'text'"
                                v-on:keyup.enter="resetPassword()">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondaryError" flat @click.native="changeModalProp">Cancel</v-btn>
          <v-btn color="secondary" flat @click.native="resetPassword()">Change password</v-btn>
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
        hashToken: '',
        email: null,
        password: null,
        confirmPassword: null,
        hiddenPassword: true,
        dictionary: {
          custom: {
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
      resetPassword () {
        this.$validator.validateAll().then(validationResult => {
          if (!validationResult) {
            // Formulario no valido
            swal(
              'Missing information',
              'You must provide both password and password confirmation',
              'info'
            )
          } else {
            // Formulario valido
            var hash = crypto.createHash('sha256').update(this.password).digest('base64')
            console.log('La hash es:', hash)
            var userList = firebase.database().ref('users').orderByChild('email')
            userList.once('value').then(async (snapshot) => {
              var data = snapshot.val()
              var emails = _.map(data, 'email')
              var hashTokens = await _.map(data, (item) => {
                console.log(item)
                return item.blockedStatus
              })
              console.log('email received', this.email)
              var emailExist = await _.indexOf(emails, this.email.replace(/\s+/g, '').toLowerCase())
              console.log('email exist', emailExist)
              console.log('tokens', hashTokens)
              if (emailExist === -1) {
                swal(
                  'Error',
                  'Invalid reset link, please retry using the forgot password option',
                  'error'
                )
              } else {
                if (this.hashToken !== hashTokens[emailExist].resetHash) {
                  swal(
                    'Error',
                    'Invalid reset link, please retry using the forgot password option',
                    'error'
                  )
                } else {
                  var dbKey = firebase.database().ref('users').orderByChild('email').equalTo(this.email.replace(/\s+/g, '').toLowerCase()).once('value')
                  dbKey.then(node => {
                    node.forEach(node => {
                      firebase.database().ref('users').child(node.key).update({
                        blockedStatus: {
                          resetHash: ''
                        },
                        password: hash
                      }).then(updatedNode => {
                        swal(
                          'OK',
                          'Its good to have you back',
                          'success'
                        )
                      })
                    })
                  })
                }
              }
            })
          }
        })
      }
    },
    mounted () {
      this.$validator.localize('es', this.dictionary)
    },
    beforeMount () {
      console.log(this.$route.query)
      if (this.$route.query.showResetPage === 'true') {
        this.$emit('changeModalProp', !this.show)
      }
      this.hashToken = this.$route.query.secK
      this.email = this.$route.query.email
    }
  }
</script>
