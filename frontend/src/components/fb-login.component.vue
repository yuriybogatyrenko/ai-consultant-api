<template>
  //here you can make your custmization button
  <v-container class="px-0">
    <div class="facebook-btn">
      <v-btn
        color="#3b5998"
        dark
        medium
        class="text-none"
        @click="logInWithFacebook"
      >
        <v-icon class="mr-2">mdi-facebook</v-icon>
        <span>Sign in with Facebook</span>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'FacebookBtn',
  mounted() {
    this.loadFacebookSDK(document, 'script', 'facebook-jssdk');
    this.initFacebook();
    // if (this.$store.state.auth.redirect) {
    //   localStorage.setItem('redirect', this.$store.state.auth.redirect);
    // }
    window.SocialLogin = this.SocialLogin;
  },
  props: {
    appId: {
      type: String,
      required: true,
    },
  },
  methods: {
    logInWithFacebook() {
      window.FB.login(function (response) {
        console.log(response);
        if (response.authResponse) {
          // Now you can redirect the user or do an AJAX request
          // here I sent authResponse From Facebook to My Request API
          this.SocialLogin(response.authResponse);
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      });
      return false;
    },
    initFacebook() {},
    loadFacebookSDK() {
      const appId = this.appId;

      window.fbAsyncInit = function () {
        console.log(appId);
        window.FB.init({
          appId: appId, //App ID, You will need to change this
          cookie: true, // This is important, it's not enabled by default
          xfbml: true,
          version: 'v20.0', // version v16.0
        });
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js?appId=' + appId;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    },
    SocialLogin(response) {
      //sent name provider with token to Socialite package to get use object
      this.$axios
        .post(
          '/social-login',
          {
            provider: 'facebook',
            token: response.accessToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          // Set the user token in the Vuex store
          this.$auth.setUserToken(response.data.token);
          this.$emit('loggedIn');
        })
        .catch((err) => {
          console.log({ err });
        });
    },
  },
};
</script>
