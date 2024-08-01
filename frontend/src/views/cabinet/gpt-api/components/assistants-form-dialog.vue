<template>
  <v-dialog v-model="localDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="assistant.name"
            label="Имя ассистента"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="assistant.model"
            label="Модель"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="assistant.description"
            label="Описание"
          ></v-text-field>
          <v-textarea
            v-model="assistant.instructions"
            label="Инструкции"
            :rules="[rules.required]"
            required
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AssistantFormDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    editingAssistant: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      assistant: this.editingAssistant
        ? { ...this.editingAssistant }
        : {
            name: '',
            model: '',
            instructions: '',
          },
      valid: false,
      rules: {
        required: (value) => !!value || 'Обязательное поле',
      },
      localDialog: this.dialog,
    };
  },
  computed: {
    formTitle() {
      return this.editingAssistant
        ? 'Редактировать ассистента'
        : 'Создать ассистента';
    },
  },
  watch: {
    editingAssistant(newVal) {
      if (newVal) {
        this.assistant = { ...newVal };
      } else {
        this.assistant = {
          name: '',
          model: '',
          instructions: '',
        };
      }
    },
    dialog(newVal) {
      this.localDialog = newVal;
    },
    localDialog(newVal) {
      if (!newVal) {
        this.$emit('close');
      }
    },
  },
  methods: {
    close() {
      this.localDialog = false;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$emit('save', this.assistant);
        this.localDialog = false;
      }
    },
  },
};
</script>

<style scoped>
/* Добавьте любые стили, которые вам нужны */
</style>
