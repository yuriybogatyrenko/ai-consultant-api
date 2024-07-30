<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="createApiKey">Создать API ключ</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-for="key in apiKeys" :key="key.id">
        <v-card>
          <v-card-title>{{ key.key }}</v-card-title>
          <v-card-actions>
            <v-btn color="red" @click="revokeApiKey(key.id)">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/api.service';
export default {
  data() {
    return {
      apiKeys: [],
    };
  },
  methods: {
    async getApiKeys() {
      // Запрос к API для получения списка ключей
      this.apiKeys = await api.get('/api-keys');
    },
    async createApiKey() {
      // Запрос к API для создания нового ключа
      await api.post('/api-keys/create');
      this.getApiKeys(); // Обновить список ключей
    },
    async revokeApiKey(id) {
      // Запрос к API для удаления ключа
      await api.post('/api-keys/revoke', { apiKeyId: id });
      this.getApiKeys(); // Обновить список ключей
    },
  },
  mounted() {
    this.getApiKeys(); // Получить список ключей при создании компонента
  },
};
</script>
