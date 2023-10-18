<template>
   <component :is="resolvedListType.component"  :cms="resolvedListType.cms" />
</template>

<script>
import { defineComponent, computed } from 'vue';
import EventList from './EventList.vue';

export default defineComponent({
  name: 'AppList',
  components: { EventList },
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const events = computed(() => props.cms.eventlistCollection.items);
    // const songs = computed(() => props.cms.scoresListCollection.items);
    // const teams = computed(() => props.cms.teamsListCollection.items);
    // const members = computed(() => props.cms.membersListCollection.items);

    const resolvedListType = computed(() => {
      if (events.value.length > 0) {
        return ({component:'EventList', cms:events.value})
      } 
      return false
    });
    return { resolvedListType };
  },
});
</script>

<style lang="scss" scoped></style>
