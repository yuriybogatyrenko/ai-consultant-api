<template>
  <v-col cols="12">
    <h3>Подключения</h3>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Telegram</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item v-if="account.telegram_settings">
              <v-list-item-content>
                <v-list-item-title>{{
                  account.telegram_settings.bot_username
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
        <v-btn @click.prevent="showTelegramForm = true">Add settings</v-btn>

        <TelegramSettingsForm
          :telegram_settings="account.telegram_settings"
          v-if="showTelegramForm"
        ></TelegramSettingsForm>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>WhatsApp</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item v-if="account.whatsapp_settings">
              <v-list-item-content>
                <v-list-item-title>{{
                  account.whatsapp_settings.phone_number_id
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
            <v-list-item v-if="account.instagram_settings">
              <v-list-item-content>
                <v-list-item-title>{{
                  account.instagram_settings.instagram_username
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script>
import api from '@/api.service';
import TelegramSettingsForm from './components/telegram-settings-form.vue';

export default {
  components: { TelegramSettingsForm },
  data() {
    return {
      showTelegramForm: false,
      account: {},
    };
  },
  async mounted() {
    await this.getAccount();
  },
  methods: {
    async getAccount() {
      const id = this.$route.params.id;
      const response = await api.get(`/accounts/${id}`);
      this.account = response.data;
    },
  },
};
</script>
