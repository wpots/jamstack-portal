<template>
  <div class="portal">
    <img alt="Vue logo" src="../assets/images/goedgebekt-logo.jpg">
    <HelloWorld msg="Welcome to Good Snogged"/>
    <LoginWidget />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import LoginWidget from '@/components/LoginWidget.vue';

export default defineComponent({
  name: 'Portal',
  components: {
    HelloWorld,
    LoginWidget,
  },
});
</script>
