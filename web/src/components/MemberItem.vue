<template>
  <div class="member-card">
    <lazy-image :media="getMedia" class="member-avatar" :id="member.name" />
    <h4>{{ member.name }}</h4>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import LazyImage from './LazyImage.vue';

export type MemberType = {
  name: string;
  range: string;
  avatar: string;
  motto?: string;
  bio?: string;
};

export default defineComponent({
  components: { LazyImage },
  props: {
    member: {
      type: Object as PropType<MemberType>,
      default: () => ({}),
    },
    idx: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const getMedia = computed(() => ({
      landscape: { src: `${props.member.avatar}?random=${props.idx}`, alt: props.member.name },
    }));
    return { getMedia };
  },
});
</script>
<style lang="scss" scoped>
.member-card {
  height: 22vh;
  position: relative;
}
.member-avatar {
  width: 100%;
  height: 100%;
}
</style>
