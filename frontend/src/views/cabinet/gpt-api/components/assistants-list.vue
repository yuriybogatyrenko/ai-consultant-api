<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click.prevent="openCreateDialog"
          >Создать ассистента</v-btn
        >
      </v-col>
      <v-col
        v-for="assistant in localAssistants"
        :key="assistant.id"
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-title>{{ assistant.name }}</v-card-title>
          <v-card-subtitle>{{ assistant.model }}</v-card-subtitle>
          <v-card-text>
            <p>
              <strong>Описание:</strong>
              {{ assistant.description || 'Нет описания' }}
            </p>
            <v-btn color="primary" @click="openEditDialog(assistant)"
              >Редактировать</v-btn
            >
          </v-card-text>

          <div class="pl-5 pr-5 d-flex align-center justify-space-between">
            <div>Функции</div>
            <div>
              <v-btn @click="openToolDialog(assistant, null)" density="compact"
                >+</v-btn
              >
            </div>
          </div>
          <v-list>
            <v-list-item
              @click="openToolDialog(assistant, tool)"
              v-for="tool in assistant.tools"
              :key="tool.function.name"
            >
              <v-list-item-title>{{ tool.function.name }}</v-list-item-title>
              <v-list-item-subtitle :title="tool.function.description">{{
                tool.function.description
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <ToolFormDialog
      :dialog="toolDialog"
      :editing-tool="editingTool"
      :assistant="toolAssistant"
      @save="handleToolSave"
      @close="toolDialog = false"
    />

    <AssistantFormDialog
      :dialog="dialog"
      :editing-assistant="editingAssistant"
      @save="handleSave"
      @close="dialog = false"
    />
  </v-container>
</template>

<script>
import AssistantFormDialog from './assistants-form-dialog.vue';
import ToolFormDialog from './tool-form-dialog.vue';

export default {
  name: 'AssistantList',
  components: {
    AssistantFormDialog,
    ToolFormDialog,
  },
  props: {
    assistants: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      toolDialog: false,
      editingAssistant: null,
      localAssistants: [...this.assistants],
      editingTool: null,
      toolAssistant: null,
    };
  },
  methods: {
    openFunctionDialog() {},
    openCreateDialog() {
      this.editingAssistant = null;
      this.dialog = true;
    },
    openEditDialog(assistant) {
      this.editingAssistant = { ...assistant };
      this.dialog = true;
    },
    handleSave(assistant) {
      this.$emit('saveAssistant', assistant);
      this.dialog = false;
    },
    openToolDialog(assistant, tool) {
      this.toolAssistant = assistant;
      this.editingTool = tool;
      this.toolDialog = true;
    },
    async handleToolSave(assistant) {
      console.log('saved assistant with new tools', assistant);

      this.$emit('saveAssistant', assistant);

      this.toolDialog = false;
    },
    handleToolDelete(assistant) {
      this.$emit('saveAssistant', assistant);
    },
  },
  watch: {
    assistants: {
      handler(newAssistants) {
        this.localAssistants = [...newAssistants];
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Добавьте любые стили, которые вам нужны */
</style>
