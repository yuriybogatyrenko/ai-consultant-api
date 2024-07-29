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

    <v-row v-if="accountData">
      <v-col cols="12">
        <h2>Настройки аккаунта</h2>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Название:</v-list-item-title>
              <v-list-item-subtitle>{{
                accountData.title
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Описание:</v-list-item-title>
              <v-list-item-subtitle>{{
                accountData.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Владелец:</v-list-item-title>
              <v-list-item-subtitle>{{
                accountData.owner?.name
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12">
        <h3>Подключения</h3>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>Telegram</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list>
                <v-list-item v-if="accountData.telegram_settings">
                  <v-list-item-content>
                    <v-list-item-title>{{
                      accountData.telegram_settings.bot_username
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>WhatsApp</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list>
                <v-list-item v-if="accountData.whatsapp_settings">
                  <v-list-item-content>
                    <v-list-item-title>{{
                      accountData.whatsapp_settings.phone_number_id
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>Instagram</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list>
                <v-list-item v-if="accountData.instagram_settings">
                  <v-list-item-content>
                    <v-list-item-title>{{
                      accountData.instagram_settings.instagram_username
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
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
      accountData: null,
    };
  },
  methods: {
    async createAccount() {
      try {
        const response = await api.post('/accounts', this.account);
        const data = response;
        this.accountData = data;
      } catch (error) {
        console.error('Ошибка при создании аккаунта:', error);
      }
    },
    async getAccounts() {
      try {
        const response = await api.get('/accounts');
        const data = response.data;
        this.accountData = data;
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
