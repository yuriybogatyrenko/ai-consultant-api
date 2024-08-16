<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Создать аккаунт</h1>
        <v-form @submit.prevent="createAccount">
          <v-text-field
            v-model="account.title"
            label="Название"
            required
          ></v-text-field>
          <v-text-field
            v-model="account.description"
            label="Описание"
          ></v-text-field>
          <v-btn type="submit" color="primary">Создать</v-btn>
        </v-form>
      </v-col>
    </v-row>

    <template v-if="accounts && accounts.length > 0">
      <h2>Настройки аккаунта</h2>
      <v-row>
        <v-col cols="4" v-for="account in accounts" :key="account.account_id">
          <v-list>
            <v-list-item>
              <v-list-item-title>Название:</v-list-item-title>
              <v-list-item-subtitle>{{ account.title }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Описание:</v-list-item-title>
              <v-list-item-subtitle>{{
                account.description
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-btn
            :to="{
              name: 'cabinet-account',
              params: { account_id: account.account_id },
            }"
            >Перейти в аккаунт</v-btn
          >
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import api from '@/api.service';
export default {
  data() {
    return {
      account: {
        title: '',
        description: '',
      },
      accounts: [],
    };
  },
  mounted() {
    this.getAccounts();
  },
  methods: {
    async createAccount() {
      try {
        const response = await api.post('/accounts', this.account);
        this.accounts.push(response);
      } catch (error) {
        console.error('Ошибка при создании аккаунта:', error);
      }
    },
    async getAccounts() {
      try {
        const response = await api.get('/accounts');
        this.accounts = response;
      } catch (error) {
        console.error('Ошибка при получении аккаунтов:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
