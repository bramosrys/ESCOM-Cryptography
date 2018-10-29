<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Sixth Practice - RSA Public & Private key encryption</p>
                    <p class="practice-description">Encrypting a txt file with AES and signing it with RSA</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Encryption</p>
                    <v-btn @click="selectPlainTextFile()">Select your plain text file</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Decryption</p>
                    <v-btn @click="selectCipheredTextFile()">Select your encrypted text file</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-container
                fluid
                grid-list-md
        >
            <v-layout row wrap>
                <v-flex xs12 md12 class="mt-3">
                    <v-card>
                        <v-card-text>
                            <p class="practice-label">Results available at: </p>
                            <p class="practice-label p-file">{{fileFromCrypto}}</p>
                            <v-divider></v-divider>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-layout>
</template>

<script>
  import electron from 'electron'

  const {ipcRenderer} = electron
  export default {
    name: "AESRSADigitalSign",
    data () {
      return {
        fileToCrypto: null,
        dataToCrypto: null,
        fileFromCrypto: null,
        resultOfCrypto: null,
        programAction: null,
        oppositeProgramAction: null,
        valid: false,
        configurations: {}
      }
    },
    methods: {
      selectPlainTextFile () {
        console.log('sending event to ipcRenderer (fileRequest)')
        ipcRenderer.send('p6:fileSelector:requestPlainTextFile', this.configurations)
        this.programAction = 'encrypt'
        this.oppositeProgramAction = 'encrypted'
      },
      selectCipheredTextFile () {
        console.log('sending event to ipcRenderer (fileRequest)')
        ipcRenderer.send('p6:fileSelector:requestEncryptedFile', this.configurations)
        this.programAction = 'decrypt'
        this.oppositeProgramAction = 'decrypted'
      }
    },
    mounted () {
      this.$electron.ipcRenderer.on('p6:fileSelector:plainTextSelected', (event, data) => {
        this.fileToCrypto = data.fileName
        this.fileFromCrypto = data.encryptedFileName
      })
      this.$electron.ipcRenderer.on('p6:fileSelector:encryptedTextSelected', (event, data) => {
        this.fileToCrypto = data.fileName
        this.fileFromCrypto = data.decryptedFileName
      })
    }
  }
</script>

<style scoped>
    .p-file {
        width: 100%;
        height: 4em;
        overflow: hidden;
    }
</style>