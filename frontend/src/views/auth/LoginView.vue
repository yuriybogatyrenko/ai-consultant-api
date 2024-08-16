<template>
  <v-container class="login-container">
    <h1>Login</h1>
    <v-form @submit.prevent="loginUser" class="login-form">
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-text-field
            v-model="form.email"
            label="Email"
            required
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            required
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3">
          <v-btn type="submit" color="primary" class="login-button"
            >Login</v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <div class="pt-5 pb-5">
      <v-btn :to="{ name: 'register' }">Registration</v-btn>
    </div>

    <div class="pt-5 pb-5" v-if="FACEBOOK_APP_ID">
      <v-facebook-login
        :app-id="FACEBOOK_APP_ID"
        version="v20.0"
      ></v-facebook-login>
    </div>
  </v-container>
</template>

<script>
import api from '@/api.service';
import authService from '@/services/auth/auth.service';
import VFacebookLogin from 'vue-facebook-login-component-next';

export default {
  components: {
    VFacebookLogin,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      FACEBOOK_APP_ID: null,
    };
  },
  mounted() {
    this.FACEBOOK_APP_ID = process.env.VUE_APP_FACEBOOK_APP_ID;
  },
  methods: {
    facebookLogin() {
      // eslint-disable-next-line no-undef
      FB.login(
        (response) => {
          console.log('facebook login', response);
          if (response.authResponse) {
            api
              .get('/auth/facebook', {
                params: { access_token: response.authResponse.accessToken },
              })
              .then((res) => {
                console.log(res);
                // Handle successful login here
              });
          } else {
            // Handle login failure
          }
        },
        { scope: 'email' },
      );
    },
    async loginUser() {
      try {
        const { email, password } = this.form;
        const authDetails = await api.post('/auth/login', { email, password });
        authService.saveToken(authDetails.access_token);
        this.$router.push({ name: 'home' });
        console.log(authDetails);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
