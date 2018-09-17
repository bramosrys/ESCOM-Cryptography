<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Fourth Practice - DES-AES Cipher</p>
                    <p class="practice-description">Encrypting a bmp file with DES-AES ciphers</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-configuration">Available configuration for the cipher:</p>
                    <v-select
                            :items="ciphers"
                            v-model="configurations.algorithm"
                            label="Select algorithm"
                            single-line
                            autocomplete
                            required
                    ></v-select>
                    <v-form ref="settingsForm" v-model="valid">
                        <v-text-field
                                v-model="configurations.password"
                                hint="Enter the password to encrypt decrypt"
                                :rules="passwordRules"
                                ref="passwordForm"
                                label="Password"
                                required
                                type="text"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Select the files to begin</p>
                    <v-btn @click="selectPlainTextFile" :disabled="!valid">Select bmp to encrypt</v-btn>
                    <v-btn @click="selectCipheredTextFile" :disabled="!valid">Select bmp to decrypt</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-container
                fluid
                grid-list-md
        >
            <v-layout row wrap>
                <!--<v-flex xs12 md6 class="mt-3">
                    <v-card>
                        <v-card-text>
                            <p class="practice-label">Contents of the file to {{programAction}}: </p>
                            <p class="practice-label p-file">{{fileToCrypto}}</p>
                            <v-divider></v-divider>
                            <img id="plain" class="logo" :src="fileToCrypto" alt="encryptedImage">
                        </v-card-text>
                    </v-card>
                </v-flex>-->
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
        name: "BitmapDesAes",
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
                ciphers: [
                    {text: 'aes-128-cbc'},
                    {text: 'aes-128-cfb'},
                    {text: 'aes-128-ofb'},
                    {text: 'aes-128-ecb'},
                    {text: 'des-cbc'},
                    {text: 'des-cfb'},
                    {text: 'des-ofb'},
                    {text: 'des-ecb'}
                ],
                configurations: {
                    algorithm: null,
                    password: null
                },
                passwordRules: [
                    v => !!v || 'Password is required'
                ],
            }
        },
        methods: {
            selectPlainTextFile() {
                console.log('BitmapDesAes - selectPlainTextFile - 112 - this.configurations.algorithm: ', this.configurations.algorithm)
                if (this.configurations.algorithm) {
                    console.log('sending event to ipcRenderer (fileRequest)')
                    ipcRenderer.send('p4:fileSelector:requestedPlainImage', this.configurations)
                    this.programAction = 'encrypt'
                    this.oppositeProgramAction = 'encrypted'
                } else {
                    alert("Select an algorithm")
                }
            },
            selectCipheredTextFile() {
                if (this.configurations.algorithm) {
                    console.log('sending event to ipcRenderer (fileRequest)')
                    ipcRenderer.send('p4:fileSelector:requestedEncryptedImage', this.configurations)
                    this.programAction = 'decrypt'
                    this.oppositeProgramAction = 'decrypted'
                } else {
                    alert("Select an algorithm")
                }
            }
        },
        mounted() {
            this.$electron.ipcRenderer.on('p4:fileSelector:plainImageSelected', (event, data) => {
                this.fileToCrypto = data.fileName
                this.fileFromCrypto = data.cipheredFileName
            })
            this.$electron.ipcRenderer.on('p4:fileSelector:encryptedImageSelected', (event, data) => {
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