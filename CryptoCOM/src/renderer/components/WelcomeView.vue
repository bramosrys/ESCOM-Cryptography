<template>
    <v-layout row wrap justify-center id="wrapper">
        <v-flex xs12 md12 class="mt-3">
            <v-card>
                <v-card-text>
                    <p class="practice-name">Welcome to my Cryptography App using Javascript and Electron</p>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md12 class="mt-3">
        </v-flex>
        <v-flex xs12 md12 class="text-xs-center centered">
            <img id="logo" class="logo" src="~@/assets/logo.png" alt="electron-vue">
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "WelcomeView"
    }
</script>


<style scoped>
    .centered {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logo {
        max-width: 70%;
    }

    .link-btn {
        width: 150px;
    }
</style>