<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" card dark>
            <v-toolbar-title>Bienvenido</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" v-model="user"
                v-validate="'required'"
                data-vv-name="username"
                :error-messages="errors.collect('username')">
              </v-text-field>
              <v-text-field label="Contraseña" v-model="password"
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
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="login">Iniciar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import swal from 'sweetalert2'
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
              required: 'Debes ingresar un email válido',
              alpha: 'Solo caracteres alfanumericos'
            },
            password: {
              required: 'Debes ingresar la contraseña'
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
              'Atención',
              'Algunos campos no son correctos, intentalo de nuevo',
              'info'
            )
          } else {
            // Formulario valido
            var hash = crypto.createHash('sha256').update(this.password).digest('base64')
            console.log('La hash es:', hash)
            /* this.$store.dispatch('login', {
              employeeNumber: this.user,
              pin: this.password
            }).then(response => {
              if (response.requestStatus === true) {
                // Auth correcta
                // Guardar Auth en local storage
                const auth = response.data
                // Para expirar el token en localStorage es necesario poner el tiempo en milisegundos
                const expirationDate = moment(new Date(auth.token.expirationDate)).diff(new Date())
                let expirationDateMS = expirationDate.valueOf()
                // Una vez que se inicio sesion hay que setear los permisos del usuario
                // Obtener permisos del usuario
                let permissions = null
                switch (this.$store.getters.employee.role.name) {
                  case 'Administrador':
                    permissions = this.$store.getters['permissions/administratorPermissions']
                    // console.log('permisos', permissions)
                    break
                  case 'Supervisor':
                    permissions = this.$store.getters['permissions/supervisorPermissions']
                    // console.log('permisos', permissions)
                    break
                  case 'Químico':
                    permissions = this.$store.getters['permissions/chemistryPermissions']
                    // console.log('permisos', permissions)
                    break
                  case 'Trabajador':
                    permissions = this.$store.getters['permissions/workerPermissions']
                    // console.log('permisos', permissions)
                    break
                  default:
                    break
                }
                // Una vez definidos los permisos se setean
                this.$store.dispatch('setUserPermissions', permissions)
                this.$ls.set('homiron', auth, expirationDateMS)
                this.$ls.set('homironPermissions', permissions, expirationDateMS)
                this.$router.replace('/')
              } else {
                // Auth incorrecta
                swal(
                  '¿Tus credenciales son correctas?',
                  response.message,
                  'warning'
                )
              }
            })
          */ }
        })
      }
    },
    mounted () {
      this.$validator.localize('es', this.dictionary)
    }
  }
</script>
