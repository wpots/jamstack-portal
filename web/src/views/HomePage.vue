<template>
  <div id="top" class="home">
    <AppHeader :cms="headerContent" />
    <main class="sections">
      <AppMain :content="contentEntries" />
    </main>

    <AppFooter :cms="footerContent" />
    <StickyWidget />
    <div v-if="error">
      {{ error.value }}
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onErrorCaptured } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import { getHomePage } from "./home.graphql";
import AppHeader from "../components/AppHeader.vue";
import AppMain from "../components/AppMain.vue";
import AppFooter from "../components/AppFooter.vue";
import StickyWidget from "@/components/StickyWidget.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    AppHeader,
    AppMain,
    AppFooter,
    StickyWidget,
  },

  setup() {
    const error = ref({});
    const { result, loading } = useQuery(getHomePage, { title: "Home" });
    const contentEntries = useResult(
      result,
      null,
      data => data.homePageCollection.items[0].pageBlocksCollection.items,
    );
    const headerContent = useResult(result, null, data => {
      return {
        nav: data.homePageCollection.items[0].pageScrollerCollection.items,
        cta: data.homePageCollection.items[0].callToAction,
      };
    });
    const footerContent = useResult(result, null, data => data.homePageCollection.items[0].footer);

    onErrorCaptured(e => {
      error.value = e;
      return true;
    });

    return { loading, contentEntries, headerContent, footerContent, error };
  },
});
</script>
