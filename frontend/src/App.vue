<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/accounts">Accounts</router-link>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  async mounted() {
    // this.loadFacebookSDK();
  },
  data() {
    return {
      fbLoaded: false,
    };
  },
  methods: {
    loadFacebookSDK() {
      window.fbAsyncInit = () => {
        // eslint-disable-next-line no-undef
        FB.init({
          appId: process.env.VUE_APP_FACEBOOK_APP_ID, // Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: 'v20.0',
        });
        this.fbLoaded = true; // SDK is now loaded
        console.log('Facebook SDK loaded');
      };

      // Load the SDK asynchronously
      ((d, s, id) => {
        let js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
