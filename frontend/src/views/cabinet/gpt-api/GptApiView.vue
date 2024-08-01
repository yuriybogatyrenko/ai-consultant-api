<template>
  <div>
    <AssistantList
      v-if="assistants"
      :assistants="assistants"
      @saveAssistant="saveAssistant"
    />
  </div>
</template>

<script>
import api from '@/api.service';
import AssistantList from './components/assistants-list.vue';

export default {
  components: { AssistantList },
  name: 'GtpApi',
  data() {
    return {
      assistants: [],
    };
  },
  mounted() {
    console.log('GtpApi mounted');
    this.getGptAssistants();
  },
  methods: {
    async getGptAssistants() {
      this.assistants = await api.get('/gpt-api', {
        params: { accountId: this.$route.params.account_id },
      });
    },
    async saveAssistant(assistant) {
      if (assistant.id) {
        await api.put(`/gpt-api/${assistant.id}`, assistant, {
          params: { accountId: this.$route.params.account_id },
        });
      } else {
        await api.post(`/gpt-api`, assistant, {
          params: { accountId: this.$route.params.account_id },
        });
      }

      await this.getGptAssistants();
    },
  },
};
</script>
