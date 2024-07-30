<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="settings.access_token"
        :rules="[rules.required]"
        label="Access Token"
        required
      ></v-text-field>

      <v-text-field
        v-model="settings.bot_username"
        :rules="[rules.required]"
        label="Bot Username"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" @click="saveSettings"
        >Save</v-btn
      >
    </v-form>

    <pre>{{ settings }}</pre>
  </v-container>
</template>

<script>
export default {
  name: 'TelegramSettingsForm',
  props: {
    telegramSettings: { type: Object, required: true },
  },
  data() {
    return {
      valid: false,
      settings: {
        access_token: '',
        bot_username: '',
        is_active: false,
      },
      rules: {
        required: (value) => !!value || 'Required.',
      },
    };
  },
  mounted() {
    this.settings = { ...this.telegramSettings };
  },
  methods: {
    async saveSettings() {
      if (this.$refs.form.validate()) {
        this.$emit('save', this.settings);
      }
    },
  },
};
</script>
