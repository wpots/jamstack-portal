<template>
  <div class="list__items col-xs-12" v-if="events?.length > 0">
    <transition-group class="row flow-in" name="flow-in" tag="ul">
      <EventItem
        v-for="(event, index) in events"
        class="list__item flow-item col-xs-12"
        :key="index"
        :event="event"
      />
    </transition-group>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import EventItem from './EventItem.vue';

export default defineComponent({
  name: 'EventList',
  components: { EventItem },
  props: {
    cms: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const events = computed(() => props.cms.eventlistCollection.items);
    return { events };
  },
});
</script>
<style lang="scss" scoped></style>
