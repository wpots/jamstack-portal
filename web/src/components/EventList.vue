<template>
  <div class="list__items col-xs-12" v-if="events?.length > 0">
    <transition-group class="row flow-in" name="flow-in" tag="ul">
      <EventItem
        v-for="song in songs"
        class="list__item flow-item col-6 col-md-4"
        :key="song.title"
        :song="song"
      />
    </transition-group>
  </div>
</template>
<script>
import EventItem from './EventItem.vue';

export default {
  name: 'EventList',
  components: { EventItem },
  props: {
    events: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
