<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Custom Fields</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <h2>Contact Custom Fields</h2>
        <v-list>
          <v-list-item
            v-for="field in contactCustomFields"
            :key="field.custom_field_id"
          >
            <v-text-field
              v-model="field.field_name"
              @focusout="handleFocusLeft(field, 'contact')"
            ></v-text-field>
            <v-list-item-title
              ><strong>Type:</strong> ({{ field.type }})</v-list-item-title
            >
            <v-list-item-subtitle>{{ field.description }}</v-list-item-subtitle>
            <v-btn
              density="compact"
              color="error"
              @click.prevent="deleteContactField(field)"
              >Удалить</v-btn
            >
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
        <h2>Account Custom Fields</h2>
        <v-list>
          <v-list-item
            v-for="field in accountCustomFields"
            :key="field.custom_field_id"
          >
            <v-row>
              <v-col cols="6">
                Name:
                <v-text-field
                  v-model="field.field_name"
                  @focusout="handleFocusLeft(field, 'account')"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                Value:
                <v-text-field
                  v-model="field.field_value"
                  @focusout="handleFocusLeft(field, 'account')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-list-item-title
              ><strong>name:</strong> {{ field.field_name }}
              <strong>value:</strong> {{ field.field_value }} (<strong
                >type:</strong
              >
              {{ field.type }})</v-list-item-title
            >
            <v-list-item-subtitle
              ><strong>description:</strong>
              {{ field.description }}</v-list-item-subtitle
            >

            <v-btn
              density="compact"
              color="error"
              @click.prevent="deleteAccountField(field)"
              >Удалить</v-btn
            >
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>Create Custom Field</h2>
        <v-form @submit.prevent="createCustomField">
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="newField.entityType"
                :items="['contact', 'account']"
                label="Entity Type"
                required
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newField.field_name"
                label="Field Name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" v-if="newField.entityType !== 'contact'">
              <v-text-field
                v-model="newField.field_value"
                label="Field Value"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="newField.type"
                :items="['text', 'number', 'date', 'boolean']"
                label="Type"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="newField.description"
                label="Description"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn type="submit" color="primary">Create</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '@/api.service';

export default {
  name: 'CustomFieldsView',
  data() {
    return {
      contactCustomFields: [],
      accountCustomFields: [],
      newField: {
        entityType: 'account',
        field_name: '',
        field_value: '',
        type: 'text',
        description: '',
      },
    };
  },
  mounted() {
    this.fetchCustomFields();
  },
  methods: {
    async createCustomField() {
      const url =
        this.newField.entityType === 'contact'
          ? '/contact-custom-fields'
          : '/account-custom-fields';

      await api.post(url, this.newField, {
        params: { accountId: this.$route.params.account_id },
      });

      this.fetchCustomFields();
    },
    async fetchCustomFields() {
      // Fetch contact custom fields
      this.contactCustomFields = await api.get('/contact-custom-fields');
      // Fetch account custom fields
      this.accountCustomFields = await api.get('/account-custom-fields');
    },
    async deleteAccountField(field) {
      await api.delete(`/account-custom-fields/${field.custom_field_id}`, {
        params: { accountId: this.$route.params.account_id },
      });
      this.fetchCustomFields();
    },

    async deleteContactField(field) {
      await api.delete(`/contact-custom-fields/${field.custom_field_id}`, {
        params: { accountId: this.$route.params.account_id },
      });
      this.fetchCustomFields();
    },

    async handleFocusLeft(field, type) {
      if (type === 'account') {
        await api.put(
          `/account-custom-fields/${field.custom_field_id}`,
          {
            field_name: field.field_name,
            field_value: field.field_value,
          },
          {
            params: { accountId: this.$route.params.account_id },
          },
        );
      } else {
        await api.put(
          `/contact-custom-fields/${field.custom_field_id}`,
          { field_name: field.field_name },
          {
            params: { accountId: this.$route.params.account_id },
          },
        );
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
