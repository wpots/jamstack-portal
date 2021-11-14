<template>
  <div class="tag-cloud" :class="{ 'filter-is-on': isActive }">
    <a
      v-for="(item, index) in items"
      class="tag-cloud-link tag-link"
      :class="{ active: isActive === item.genre }"
      :style="getFontSize(item.total)"
      :key="index"
      @click="activeHandle(item)"
      >{{ item.genre }} <small>({{ item.total }})</small></a
    >
  </div>
</template>
<script>
import { ref, defineComponent, computed } from 'vue';

export default defineComponent({
  emits: ['updatesortable'],
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const isActive = ref(null);
    const activeHandle = (item) => {
      if (isActive.value === item.genre) {
        isActive.value = null;
      } else {
        isActive.value = item.genre;
      }
      emit('updatesortable', isActive.value);
    };
    const getFontSize = computed(() => (count) => {
      return { fontSize: ` ${count * 0.7 + 8}pt` };
    });
    return { isActive, activeHandle, getFontSize };
  },
});
</script>
