<template>
  <div class="register-view">
    <h1>Register</h1>
    <form @submit.prevent="registerUser" class="register-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script>
import api from '@/api.service';

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async registerUser() {
      this.errorMessage = ''; // Сброс сообщения об ошибке перед попыткой регистрации
      try {
        await api.post('/auth/register', this.form);
        // Обработка успешной регистрации
        this.$router.push({ name: 'login' });
      } catch (error) {
        // Обработка ошибки регистрации
        this.errorMessage =
          error.response?.message ||
          'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.';
        console.log(error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.register-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 300px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

input[type='email'],
input[type='password'] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #0056b3;
}
</style>
