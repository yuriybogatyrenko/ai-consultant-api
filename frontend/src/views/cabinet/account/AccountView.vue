<template>
  <v-col cols="12">
    <h3>Подключения</h3>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>GPT</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            v-model="accountSettings.gpt_api_key"
            label="API Key"
            required
          />
          <v-btn @click.prevent="saveGptKey">Save</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

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

        <v-switch
          v-model="accountSettings.telegram.is_active"
          color="success"
          label="Is Active"
          @change="toggleTelegram($event)"
        ></v-switch>
        <v-btn @click.prevent="showTelegramForm = true">Add settings</v-btn>

        <TelegramSettingsForm
          @save="saveTelegramSettings"
          :telegram-settings="account.telegram_settings"
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
      accountSettings: {
        telegram: {
          is_active: false,
        },
        gpt_api_key: '',
      },
    };
  },
  async mounted() {
    await this.getAccount();
  },
  methods: {
    async getAccount() {
      const id = this.$route.params.id;
      this.account = await api.get(`/accounts/${id}`).then((response) => {
        this.accountSettings.telegram.is_active =
          response.telegram_settings.is_active;
        this.accountSettings.gpt_api_key = response.gpt_api_key;
        return response;
      });
    },
    async saveTelegramSettings(data) {
      this.account = await api.post(
        `/accounts/${this.$route.params.id}/telegram-settings`,
        data,
      );
      this.showTelegramForm = false;
    },
    async toggleTelegram() {
      try {
        await api.post('/platform-telegram/toggle', {
          id: this.account.telegram_settings.id,
          isActive: this.accountSettings.telegram.is_active,
        });
      } catch (error) {
        this.accountSettings.telegram.is_active =
          !this.accountSettings.telegram.is_active;
      }
    },
    saveGptKey() {
      api.post(`/accounts/${this.$route.params.id}/gpt-api-key`, {
        gpt_api_key: this.accountSettings.gpt_api_key,
      });
    },
  },
};
</script>
