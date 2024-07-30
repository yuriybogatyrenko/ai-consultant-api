<template>
  <div></div>
</template>

<script>
import api from '@/api.service';

export default {
  name: 'GtpApi',
  mounted() {
    console.log('GtpApi mounted');
    this.getGptAssistants();
  },
  methods: {
    async getGptAssistants() {
      await api
        .get('/gpt-api', {
          params: { accountId: this.$route.params.account_id },
        })
        .then((response) => {
          console.log(response);
        });
    },
  },
};
</script>
