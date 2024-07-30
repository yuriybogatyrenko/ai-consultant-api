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
  </v-container>
</template>

<script>
import api from '@/api.service';
import authService from '@/services/auth/auth.service';

export default {
  data() {
    return {
      form: { email: '', password: '' },
    };
  },
  methods: {
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
