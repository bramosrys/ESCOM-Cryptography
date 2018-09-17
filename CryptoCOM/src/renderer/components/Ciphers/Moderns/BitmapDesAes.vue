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
                <v-flex xs12 md6 class="mt-3">
                    <v-card>
                        <v-card-text>
                            <p class="practice-label">Contents of the file to {{programAction}}: </p>
                            <p class="practice-label p-file">{{fileToCrypto}}</p>
                            <v-divider></v-divider>

                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 md6 class="mt-3">
                    <v-card>
                        <v-card-text>
                            <p class="practice-label">Contents of the file {{oppositeProgramAction}}: </p>
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
                    algorithm: 'aes-128-cbc',
                    password: 'holabeibi'
                },
                passwordRules: [
                    v => !!v || 'Password is required'
                ],
            }
        },
        methods: {
            selectPlainTextFile() {
                console.log('sending event to ipcRenderer (fileRequest)')
                ipcRenderer.send('p4:fileSelector:requestedPlainText', this.configurations)
                this.programAction = 'encrypt'
                this.oppositeProgramAction = 'encrypted'
            },
            selectCipheredTextFile() {
                console.log('sending event to ipcRenderer (fileRequest)')
                ipcRenderer.send('p2:fileSelector:requestedEncryptedText', this.configurations)
                this.programAction = 'decrypt'
                this.oppositeProgramAction = 'decrypted'
            }
        },
/*        computed: {
            algorithm() {
                return this.configurations.algorithm
            },
        },*/
        mounted() {
            this.$electron.ipcRenderer.on('p2:fileSelector:plainTextSelected', (event, data) => {
                if (!data.rejected) {
                    this.fileToCrypto = data.fileName
                    this.dataToCrypto = data.contents
                    this.fileFromCrypto = data.cipheredFileName
                    this.resultOfCrypto = data.cipheredContents
                } else {
                    this.fileToCrypto = data.fileName
                    this.dataToCrypto = data.contents
                    this.fileFromCrypto = null
                    this.resultOfCrypto = null
                    alert(data.cipheredContents)
                }
            })
            this.$electron.ipcRenderer.on('p2:fileSelector:cipheredTextSelected', (event, data) => {
                if (!data.rejected) {
                    this.fileToCrypto = data.fileName
                    this.dataToCrypto = data.contents
                    this.fileFromCrypto = data.decryptedFileName
                    this.resultOfCrypto = data.decryptedContents
                } else {
                    this.fileToCrypto = data.fileName
                    this.dataToCrypto = data.contents
                    this.fileFromCrypto = null
                    this.resultOfCrypto = null
                    alert(data.decryptedContents)
                }

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