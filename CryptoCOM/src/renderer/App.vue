<template>
    <div id="app">
        <v-app>
            <v-navigation-drawer
                    fixed
                    :mini-variant="miniVariant"
                    :clipped="clipped"
                    v-model="drawer"
                    app
            >
                <v-list>
                    <v-list-tile
                            router
                            :to="item.to"
                            :key="i"
                            v-for="(item, i) in items"
                            exact
                            @click=""
                    >
                        <v-list-tile-action>
                            <v-icon v-html="item.icon"></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title"></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar dark app color="primary" :clipped-left="clipped">
                <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>ESCOM - CRYPTOGRAPHY</v-toolbar-title>
                <v-spacer></v-spacer>
                <div class="practice-name">Brayan Ramos R.</div>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-content>
                <v-container fluid>
                    <v-fade-transition mode="out-in">
                        <router-view></router-view>
                    </v-fade-transition>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import WelcomeView from "./components/WelcomeView";

    export default {
        name: 'CryptoCOM',
        components: {WelcomeView},
        data: () => ({
            clipped: false,
            drawer: true,
            fixed: false,
            items: [
                {icon: 'apps', title: 'Home Page', to: '/'},
                {icon: 'file_copy', title: 'Appendix', to: 'appendix'},
                {icon: 'bubble_chart', title: "Cesar's cipher", to: 'caesars'},
                {icon: 'mdi-alpha', title:"Affine's cipher", to: 'affine' },
                {icon: 'mdi-alpha', title:"Euclidean algorithm - Affine", to: 'euclideanAffine' },
                {icon: 'mdi-blur-off', title:"Bitmap Cipher", to: 'bmpCipher' }
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
        })
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
    /* Global CSS */
    .practice-name
    {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 900;
        font-size: 20px;
        letter-spacing: 0px;
        overflow: hidden;
    }
    .practice-description
    {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: 18px;
        letter-spacing: 1px;
        overflow: hidden;
    }

    .practice-configuration
    {
        display: flex;
        justify-content: left;
        align-items: left;
        font-weight: 900;
        font-size: 20px;
        letter-spacing: 1px;
        overflow: hidden;
    }
    .practice-configuration-item
    {
        display: flex;
        justify-content: left;
        align-items: left;
        font-weight: 300;
        font-size: 16px;
        letter-spacing: 0px;
        overflow: hidden;
    }
    .practice-label
    {
        display: flex;
        justify-content: left;
        align-items: left;
        font-weight: 300;
        font-size: 14px;
        letter-spacing: 0px;
        overflow: hidden;
    }
</style>
