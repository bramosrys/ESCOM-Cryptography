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
                    <p class="practice-configuration">Available configuration for the cipher:</p>
                    <v-form ref="settingsForm" v-model="valid">
                        <v-text-field
                                v-model="configurations.key"
                                hint="Enter the key to encrypt decrypt"
                                :rules="keyRules"
                                ref="keyForm"
                                label="RSA 2048 Key"
                                required
                                multi-line
                                type="text"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Select the key file</p>
                    <v-btn @click="selectPlainTextFile('Public')" :disabled="!valid">Select txt to encrypt</v-btn>
                    <v-btn @click="selectCipheredTextFile('Public')" :disabled="!valid">Select txt to decrypt</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Using Public Key</p>
                    <v-btn @click="selectPlainTextFile('Public')" :disabled="!valid">Select txt to encrypt</v-btn>
                    <v-btn @click="selectCipheredTextFile('Public')" :disabled="!valid">Select txt to decrypt</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Using private Key</p>
                    <v-btn @click="selectPlainTextFile('Private')" :disabled="!valid">Select txt to encrypt</v-btn>
                    <v-btn @click="selectCipheredTextFile('Private')" :disabled="!valid">Select txt to decrypt</v-btn>
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
    data() {
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
      selectPlainTextFile(keyTpe) {
        if (this.configurations.key) {
          this.configurations.keyType = keyTpe
          console.log('sending event to ipcRenderer (fileRequest)')
          ipcRenderer.send('p5:fileSelector:requestPlainTextFile', this.configurations)
          this.programAction = 'encrypt'
          this.oppositeProgramAction = 'encrypted'
        } else {
          alert("Enter a key")
        }
      },
      selectCipheredTextFile(keyType) {
        if (this.configurations.key) {
          this.configurations.keyType = keyType
          console.log('sending event to ipcRenderer (fileRequest)')
          ipcRenderer.send('p5:fileSelector:requestEncryptedFile', this.configurations)
          this.programAction = 'decrypt'
          this.oppositeProgramAction = 'decrypted'
        } else {
          alert("Enter a key")
        }
      }
    },
    mounted() {
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