<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Second Practice - Affine's Cipher</p>
                    <p class="practice-description">Using a monoalphabetic substitution cipher to obfuscate a text file
                        using the english alphabet</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-configuration">Available configuration for the cipher:</p>
                    <v-form ref="settingsForm" v-model="valid">
                        <v-text-field
                                v-model="configurations.fakeAlphaNumber"
                                hint="This is known as Alpha"
                                :rules="alphaRules"
                                ref="alphaTextField"
                                label="Multiplicative factor"
                                required
                                type="number"
                        ></v-text-field>
                        <v-text-field
                                v-model="configurations.fakeBetaNumber"
                                hint="This is known as Beta"
                                :rules="betaRules"
                                label="Additive factor"
                                required
                                type="number"
                        ></v-text-field>
                        <v-text-field
                                v-model="configurations.fakeAlphabetRange"
                                hint="This is the range of lower case letters that the cipher can use"
                                :rules="alphabetRules"
                                label="Alphabet range"
                                required
                                type="string"
                        ></v-text-field>
                        <v-btn
                                :disabled="!valid"
                                @click="submitSettings"
                        >
                            Save settings
                        </v-btn>
                        <v-btn @click="clear">Reset settings</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Select the files to begin</p>
                    <v-btn @click="selectPlainTextFile">Select file to obfuscate</v-btn>
                    <v-btn @click="selectCipheredTextFile">Select file to decrypt</v-btn>
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
                            <v-text-field
                                    textarea
                                    v-model="dataToCrypto"
                                    name="contentsFileToCrypto"
                                    :label=fileToCrypto
                                    rows="10"
                                    outline
                                    readonly
                            ></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 md6 class="mt-3">
                    <v-card>
                        <v-card-text>
                            <p class="practice-label">Contents of the file {{oppositeProgramAction}}: </p>
                            <p class="practice-label p-file">{{fileFromCrypto}}</p>
                            <v-divider></v-divider>
                            <v-text-field
                                    textarea
                                    v-model="resultOfCrypto"
                                    name="contentsResultOfCrypto"
                                    :label=fileFromCrypto
                                    rows="10"
                                    outline
                                    readonly
                            ></v-text-field>
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
    const math = require('mathjs')
    const _ = require('lodash')
    const path = require('path')
    export default {
        name: "AffineCipher",
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
                    alphaNumber: 1,
                    fakeAlphaNumber: 1,
                    betaNumber: 1,
                    fakeBetaNumber: 1,
                    removeSpaces: true,
                    stripAccents: true,
                    alphabetLength: 26,
                    fakeAlphabetRange: "a-z",
                    alphabetRange: 'a-z',
                },
                betaRules: [
                    v => !!v || 'Beta is required',
                    (v) => v <= 25 || 'Beta must be between 1 and (alphabet length - 1) which is ' + (this.configurations.alphabetLength - 1),
                    (v) => v >= 1 || 'Beta must be between 1 and (alphabet length - 1) which is ' + (this.configurations.alphabetLength - 1),
                    (v) => /^(\d*)?\d+$/.test(v) || 'Decimal values are not allowed',
                ],
                alphaRules: [
                    v => !!v || 'Alpha is required',
                    (v) => v <= 25 || 'Alpha must be between 1 and (alphabet length - 1) which is ' + (this.configurations.alphabetLength - 1),
                    (v) => v >= 1 || 'Alpha must be between 1 and (alphabet length - 1) which is ' + (this.configurations.alphabetLength - 1),
                    (v) => /^(\d*)?\d+$/.test(v) || 'Decimal values are not allowed',
                    (v) => this.validateCoprimeWithAlpha(v) || `Alpha cannot be that number - gcd(${this.configurations.alphabetLength},${v}) = ${this.gcd}`
                ],
                alphabetRules: [
                    v => !!v || 'Alphabet range is required',
                    (v) => /^(([a-z]){1}(-)([a-z]){1})$/.test(v) || 'Alphabet range must be written in this pattern: a-z (only lower case)',
                    (v) => this.validateAlphabetRange(v) || `The range it's not valid, must be written like this: a-z (lowest char first)`
                ],
            }
        },
        methods: {
            validateCoprimeWithAlpha(v) {
                if (v) {
                    var num = parseFloat(v)
                    if (Number.isInteger(num)) {
                        this.gcd = math.gcd(Math.abs(this.configurations.alphabetLength), Math.abs(num))
                        if (this.gcd === 1) { //This are coprimes
                            return true
                        } else {
                            return false
                        }
                    }
                }
            },
            validateAlphabetRange(v) {
                if (v) {
                    var range = v.split('-')
                    if (_.indexOf(range, "") === -1 && range.length > 1) {
                        if (range[0].charCodeAt(0) < range[1].charCodeAt(0)) {
                            this.configurations.alphabetLength = range[1].charCodeAt(0) - range[0].charCodeAt(0) + 1
                            return true
                        } else {
                            this.configurations.alphabetLength = 26
                            this.configurations.fakeAlphaNumber = 1
                            this.configurations.fakeBetaNumber = 1
                            this.configurations.alphaNumber = 1
                            this.configurations.betaNumber = 1
                            return false
                        }
                    } else {
                        this.configurations.alphabetLength = 26
                        this.configurations.fakeAlphaNumber = 1
                        this.configurations.fakeBetaNumber = 1
                        this.configurations.alphaNumber = 1
                        return false
                    }
                }
            },
            submitSettings() {
                if (this.$refs.settingsForm.validate()) {
                    this.configurations.betaNumber = parseInt(this.configurations.fakeBetaNumber)
                    this.configurations.alphaNumber = parseInt(this.configurations.fakeAlphaNumber)
                    this.configurations.alphabetRange = this.configurations.fakeAlphabetRange
                    this.configurations.alphabetLength = this.configurations.alphabetRange.charCodeAt(2) - this.configurations.alphabetRange.charCodeAt(0) + 1
                }
            },
            clear() {
                this.$refs.settingsForm.reset()
            },
            selectPlainTextFile() {
                console.log('sending event to ipcRenderer (fileRequest)')
                ipcRenderer.send('p2:fileSelector:requestedPlainText', this.configurations)
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