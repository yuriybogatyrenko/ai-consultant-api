<template>
  <v-dialog v-model="localDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <!-- <v-form ref="form" @sumbit.prevent="save" v-model="valid"> -->
        <JsonEditorVue v-model="tool.function" />
        <!-- </v-form> -->
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click.prevent="deleteFn">Удалить</v-btn>
        <v-btn color="blue darken-1" text @click.prevent="close">Отмена</v-btn>
        <v-btn color="blue darken-1" text @click.prevent="save"
          >Сохранить</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import JsonEditorVue from 'json-editor-vue';
export default {
  name: 'ToolFormDialog',
  components: {
    JsonEditorVue,
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    editingTool: {
      type: Object,
      default: () => null,
    },
    assistant: {
      type: Object,
    },
  },
  data() {
    return {
      tool: this.editingTool
        ? {
            ...this.editingTool,
          }
        : {
            function: {
              name: '',
              description: '',
              parameters: '',
            },
          },
      localDialog: this.dialog,
    };
  },
  computed: {
    formTitle() {
      return this.editingTool ? 'Редактировать Tool' : 'Создать Tool';
    },
  },
  watch: {
    editingTool(newVal) {
      if (newVal) {
        this.tool = { ...newVal };
      } else {
        this.setDefaultTool();
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
  mounted() {
    if (!this.editingTool) this.setDefaultTool();
  },
  methods: {
    close() {
      this.localDialog = false;
    },
    deleteFn() {
      const localAssistant = this.assistant;
      localAssistant.tools = localAssistant.tools.filter(
        (tool) => tool.function.name !== this.tool.function.name,
      );
      this.$emit('save', localAssistant);
    },
    setDefaultTool() {
      this.tool = {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Determine weather in my location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state e.g. San Francisco, CA',
              },
              unit: {
                type: 'string',
                enum: ['c', 'f'],
              },
            },
            required: ['location'],
          },
        },
      };
    },
    save() {
      const localAssistant = this.assistant;
      const foundItem = this.assistant.tools.find((tool, index) => {
        if (tool.function.name === this.tool.function.name) {
          localAssistant.tools[index] = { ...this.tool };
          return true;
        }
      });

      if (!foundItem) {
        localAssistant.tools.push({ ...this.tool });
      }

      this.$emit('save', localAssistant);
      //   this.localDialog = false;
    },
  },
};
</script>

<style scoped>
/* Добавьте любые стили, которые вам нужны */
</style>
