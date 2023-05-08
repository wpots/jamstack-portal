<template>
  <div id="top">
    <AppHeader />
    <main class="sections">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    <AppFooter />
    <StickyWidget v-if="$route.name !== 'programma'" />
  </div>
</template>
<script>
import { defineComponent, provide } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "./apollo/contentful.config";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import StickyWidget from "./components/StickyWidget.vue";

export default defineComponent({
  components: {
    AppHeader,
    AppFooter,
    StickyWidget,
  },
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Julius+Sans+One|Montserrat:400,700|Muli|Satisfy");
</style>
