<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Zero Practice - Cesar's Cipher</p>
                    <p class="practice-description">Using any integrated library to encrypt a text file with any algorithm</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex  xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-configuration">This cipher has no configuration available</p>
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
        <v-flex xs12 md6 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-label">Contents of the file to {{programAction}}: </p>
                    <p class="practice-label">{{fileToCrypto}}</p>
                    <v-text-field
                            textarea
                            v-model="dataToCrypto"
                            name="contentsFileToCrypto"
                            :label=fileToCrypto
                            rows="15"
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
                    <p class="practice-label">{{fileFromCrypto}}</p>
                    <v-text-field
                            textarea
                            v-model="resultOfCrypto"
                            name="contentsResultOfCrypto"
                            :label=fileFromCrypto
                            rows="15"
                            outline
                            readonly
                    ></v-text-field>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import electron from 'electron'
    const {ipcRenderer} = electron
    export default {
        name: "AppendixCipher",
        data() {
            return {
                fileToCrypto: null,
                dataToCrypto: null,
                fileFromCrypto: null,
                resultOfCrypto: null,
                programAction: null,
                oppositeProgramAction: null,
                valid: false,
                configurations: {
                    shiftNumber: 3,
                    fakeShiftNumber: 3,
                    removeSpaces: true,
                    stripAccents: true,
                    alphabetLength: 26
                },
                shiftRules: [
                    v => !!v || 'The shit count is required',
                    (v) => v <= 25 || 'Shift count must be between 1 and (alphabet length - 1) which is ' + (this.configurations.alphabetLength-1),
                    (v) => v >= 1 || 'Shift count must be between 1 and (alphabet length - 1) which is ' + (this.configurations.alphabetLength-1),
                    (v) => /^(\d*)?\d+$/.test(v) || 'Decimal values are not allowed',
                ],
            }
        },
        methods: {
            selectPlainTextFile(){
                console.log('sending event to ipcRenderer (fileRequest)')
                ipcRenderer.send('p0:fileSelector:requestedPlainText',this.configurations)
                this.programAction = 'encrypt'
                this.oppositeProgramAction = 'encrypted'
            },
            selectCipheredTextFile(){
                console.log('sending event to ipcRenderer (fileRequest)')
                ipcRenderer.send('p0:fileSelector:requestedEncryptedText',this.configurations)
                this.programAction = 'decrypt'
                this.oppositeProgramAction = 'decrypted'
            }
        },
        mounted(){
            this.$electron.ipcRenderer.on('p0:fileSelector:plainTextSelected',(event,data)=>{
                this.fileToCrypto = data.fileName
                this.dataToCrypto = data.contents
                this.fileFromCrypto = data.cipheredFileName
                this.resultOfCrypto = data.cipheredContents
            })
            this.$electron.ipcRenderer.on('p0:fileSelector:cipheredTextSelected',(event,data)=>{
                this.fileToCrypto = data.fileName
                this.dataToCrypto = data.contents
                this.fileFromCrypto = data.decryptedFileName
                this.resultOfCrypto = data.decryptedContents
            })

        }
    }
</script>

<style scoped>

</style>