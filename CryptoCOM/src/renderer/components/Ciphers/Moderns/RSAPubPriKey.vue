<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Fifth Practice - AES Public & Private key encryption</p>
                    <p class="practice-description">Encrypting a txt file with AES 2048b</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Encryption</p>
                    <v-btn @click="selectPlainTextFile('Public')">Using public key</v-btn>
                    <v-btn @click="selectPlainTextFile('Private')">Using private key</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Decryption</p>
                    <v-btn @click="selectCipheredTextFile('Public')">Using public key</v-btn>
                    <v-btn @click="selectCipheredTextFile('Private')">Using private key</v-btn>
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
    name: "RSAPubPriKey",
    data () {
      return {
        fileToCrypto: null,
        dataToCrypto: null,
        fileFromCrypto: null,
        resultOfCrypto: null,
        programAction: null,
        gcd: null,
        oppositeProgramAction: null,
        valid: false,
        configurations: {
          key: null,
          keyType: null
        },
        keyRules: [
          v => !!v || 'The key is required'
        ],
      }
    },
    methods: {
      selectPlainTextFile (keyTpe) {
        this.configurations.keyType = keyTpe
        console.log('sending event to ipcRenderer (fileRequest)')
        ipcRenderer.send('p5:fileSelector:requestPlainTextFile', this.configurations)
        this.programAction = 'encrypt'
        this.oppositeProgramAction = 'encrypted'
      },
      selectCipheredTextFile (keyType) {
        this.configurations.keyType = keyType
        console.log('sending event to ipcRenderer (fileRequest)')
        ipcRenderer.send('p5:fileSelector:requestEncryptedFile', this.configurations)
        this.programAction = 'decrypt'
        this.oppositeProgramAction = 'decrypted'
      }
    },
    mounted () {
      this.$electron.ipcRenderer.on('p5:fileSelector:plainTextSelected', (event, data) => {
        this.fileToCrypto = data.fileName
        this.fileFromCrypto = data.encryptedFileName
      })
      this.$electron.ipcRenderer.on('p5:fileSelector:encryptedTextSelected', (event, data) => {
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

    .logo {
        max-width: 70%;
    }
</style>