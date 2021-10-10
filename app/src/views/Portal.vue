<template>
  <div class="portal">
    <LoginWidget />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginWidget from '@/components/LoginWidget.vue';

export default defineComponent({
  name: 'Portal',
  components: {
    LoginWidget,
  },
});
</script>
