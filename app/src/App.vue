<template>
  <router-view/>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
