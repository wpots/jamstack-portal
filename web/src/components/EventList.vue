<template>
  <div class="list__items" v-if="events?.length > 0">
    <transition-group class="list--figure row flow-in" name="flow-in" tag="ul">
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
import { defineComponent, computed } from "vue";
import EventItem from "./EventItem.vue";

export default defineComponent({
  name: "EventList",
  components: { EventItem },
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
    return { events };
  },
});
</script>
<style lang="scss" scoped></style>
