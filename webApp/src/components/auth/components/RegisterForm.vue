<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="850px">
      <v-card>
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Registrar Usuario</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Correo*" v-model="email"
                                v-validate="'required|email'" data-vv-name="email"
                                :error-messages="errors.collect('email')">
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Contraseña*" v-model="password"
                                v-validate="'required|alpha_num|min:8|max:32'" data-vv-name="password"
                                :error-messages="errors.collect('password')"
                                :append-icon="hiddenPassword ? 'visibility' : 'visibility_off'"
                                @click:append="() => (hiddenPassword = !hiddenPassword)"
                                :type="hiddenPassword ? 'password' : 'text'">
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Repetir contraseña*" v-model="confirmPassword"
                                v-validate="'required|alpha_num|min:8|max:32|is:password'" data-vv-name="confirmPassword"
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
  // import _ from 'lodash'
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
            /* let user = {
              employeeNumber: this.employeeNumber,
              name: this.name,
              genre: this.genre,
              userRole: this.userRole,
              birthDate: this.birthDate,
              pin: this.pin,
              managerUser: this.manager
            }
            this.$store.dispatch('users/createUser', user).then(response => {
              if (response.requestStatus === true) {
                swal(
                  'Ok',
                  response.message,
                  'success'
                )
                this.clearData()
                this.changeModalProp()
              } else {
                swal(
                  'Atención',
                  response.message,
                  'warning'
                )
              }
            }) */
          }
        })
      }
    },
    mounted () {
      this.$validator.localize('es', this.dictionary)
    },
    computed: {
      userRoles () {
        let userRoles = this.$store.getters['users/roles']
        if (userRoles === null || userRoles === undefined) {
          return []
        } else {
          return userRoles
        }
      }
    }
  }
</script>
