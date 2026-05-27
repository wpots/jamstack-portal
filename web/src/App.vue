<template>
  <router-view />
</template>
<script>
import { defineComponent, provide } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import apolloClient from './apollo/contentful.config';

export default defineComponent({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
});
</script>

<style lang="scss">
@use '@/assets/styles/common/variables' as *;
@use '@/assets/styles/common/mixins' as *;
@import url('https://fonts.googleapis.com/css?family=Julius+Sans+One|Montserrat:400,700|Muli|Satisfy');
</style>
