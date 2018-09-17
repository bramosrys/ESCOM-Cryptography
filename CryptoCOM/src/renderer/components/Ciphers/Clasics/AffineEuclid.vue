<template>
    <v-layout row wrap justify-center>
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Third Practice - Euclidean Algorithm</p>
                    <p class="practice-description">Using the Euclidean Algorithm to calculate the GCD & the coprimes of the ring.</p>
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
                                hint="This is the number to match against alpha"
                                :rules="alphabetRules"
                                label="N (ring number)"
                                required
                                type="number"
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
        <v-container
                fluid
                grid-list-md
        >
            <v-layout row wrap>
                <v-flex xs12 md12 class="mt-3">
                    <v-card>
                        <v-card-title class="practice-configuration"> On demand results</v-card-title>
                        <v-container grid-list-md text-xs-center>
                            <v-layout row wrap v-if="this.gcdValid">
                                <v-flex md3 xs12>
                                    <p class="practice-label">Alpha: {{configurations.alphaNumber}}</p>
                                </v-flex>
                                <v-flex md3 xs12>
                                    <p class="practice-label">Alpha Inverse: {{results.alphaInverse}}</p>
                                </v-flex>
                                <v-flex md3 xs12>
                                    <p class="practice-label">Beta: {{configurations.betaNumber}}</p>
                                </v-flex>
                                <v-flex md3 xs12>
                                    <p class="practice-label">Beta Inverse: {{betaInverse}}</p>
                                </v-flex>
                                <v-flex md6 xs12
                                        v-if="configurations.alphaNumber && configurations.betaNumber && configurations.alphabetLength && betaInverse && results.alphaInverse">
                                    <p class="practice-label">Ek: ({{configurations.alphaNumber}} p +
                                        {{configurations.betaNumber}}) mod {{configurations.alphabetLength}}</p>
                                </v-flex>
                                <v-flex md6 xs12
                                        v-if="configurations.alphaNumber && configurations.betaNumber && configurations.alphabetLength && betaInverse && results.alphaInverse">
                                    <p class="practice-label">Dk: ({{results.alphaInverse%this.nRing}}C + {{(betaInverse*results.alphaInverse) % this.nRing}}) mod
                                        {{configurations.alphabetLength}}</p>
                                </v-flex>
                            </v-layout>
                        </v-container>
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
    export default {
        name: "AffineCipherEuclid",
        data() {
            return {
                gcd: null,
                gcdValid: true,
                valid: false,
                configurations: {
                    alphaNumber: 1,
                    fakeAlphaNumber: 1,
                    betaNumber: 1,
                    fakeBetaNumber: 1,
                    removeSpaces: true,
                    stripAccents: true,
                    alphabetLength: 26,
                    fakeAlphabetRange: 26
                },
                results: {
                    betaInverse: null,
                    alphaInverse: null
                },
                betaRules: [
                    v => !!v || 'Beta is required',
                    (v) => v <= this.nRing - 1 || 'Beta must be between 1 and (alphabet length - 1) - max value allowed: ' + (this.nRing - 1),
                    (v) => v >= 1 || 'Beta must be >0',
                    (v) => /^(\d*)?\d+$/.test(v) || 'Decimal values are not allowed',
                ],
                alphaRules: [
                    v => !!v || 'Alpha is required',
                    (v) => v <= this.nRing - 1 || 'Alpha must be between 1 and (alphabet length - 1) - max value allowed: ' + (this.nRing -1),
                    (v) => v >= 1 || 'Alpha must > 0',
                    (v) => /^(\d*)?\d+$/.test(v) || 'Decimal values are not allowed',
                    (v) => this.calcGcd(v, this.nRing) && this.gcdValid || `Alpha cannot be that number - gcd(${v},${this.nRing}) = ${this.gcd}`
                    //(v) => this.calcGcd(v, this.configurations.alphabetLength).valid
                ],
                alphabetRules: [
                    v => !!v || 'N is required',
                    (v) => /^(\d*)?\d+$/.test(v) || 'Decimal values are not allowed',
                ],
            }
        },
        computed: {
            betaInverse() {
                return (this.configurations.fakeBetaNumber > 0 && this.gcdValid ? this.nRing - this.configurations.fakeBetaNumber : null)
            },
            nRing(){
                return parseInt(this.configurations.fakeAlphabetRange)
            }
        },
        methods: {
            calcGcd(a, b) {
                if (b === 0) {
                    return [1, 0, a]
                }
                else {
                    let temp = this.calcGcd(b, a % b)
                    var x = temp[0]
                    var y = temp[1]
                    var d = temp[2]
                    console.log('AffineEuclid - calcGcd - 159 - temp: ',temp)
                    this.gcd = d
                    this.gcdValid = d === 1
                    this.results.betaInverse = this.nRing - this.configurations.betaNumber
                    console.log('AffineEuclid - calcGcd - 163 - this.nRing: ',this.nRing)

                    console.log('AffineEuclid - calcGcd - 164 - : ',y+this.nRing)
                    console.log('AffineEuclid - calcGcd - 163 - y+this.nRing % this.nRing: ',(y+this.nRing) % this.nRing)
                    this.results.alphaInverse = this.gcdValid ? (y < 0 ? (y + this.nRing) % this.nRing : y % this.nRing) : null
                    console.log('AffineEuclid - calcGcd - 164 - this.results.alphaInverse: ',this.results.alphaInverse)
                    return [y, x - y * Math.floor(a / b), d]
                }
            },
            submitSettings() {
                if (this.$refs.settingsForm.validate()) {
                    this.configurations.betaNumber = parseInt(this.configurations.fakeBetaNumber)
                    this.configurations.alphaNumber = parseInt(this.configurations.fakeAlphaNumber)
                    this.configurations.alphabetRange = this.configurations.fakeAlphabetRange
                    this.configurations.alphabetLength = this.nRing
                }
            },
            clear() {
                this.$refs.settingsForm.reset()
            },
        },
    }
</script>

<style scoped>
    .p-file {
        width: 100%;
        height: 4em;
        overflow: hidden;
    }
</style>