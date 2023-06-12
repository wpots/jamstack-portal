<template>
  <div class="list__items" v-if="upcomingEvents?.length > 0">
    <transition-group class="list--figure row flow-in" name="flow-in" tag="ul">
      <EventItem
        v-for="(event, index) in upcomingEvents"
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
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const events = computed(() => props.cms.eventlistCollection.items);
    const upcomingEvents = computed(() =>
      events.value.filter(event => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(event.date).setHours(0, 0, 0, 0);
        return eventDate >= today;
      }),
    );
    return { upcomingEvents };
  },
});
</script>
<style lang="scss" scoped></style>
