<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    loginUser() {
      // Perform user login logic here
      // You can access the email and password values using this.email and this.password
      // For example, you can make an API call to authenticate the user
      // axios.post('/api/login', { email: this.email, password: this.password })
      //   .then(response => {
      //     // Handle successful login
      //   })
      //   .catch(error => {
      //     // Handle login error
      //   })
    },
  },
};
</script>
