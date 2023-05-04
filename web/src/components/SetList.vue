<template>
  <transition-group class="block-list" name="flow-in" tag="ul">
    <li v-for="(item, index) in setItems" class="blockie" :key="index">
      <div class="content">
        <p v-if="item.description">{{ item.description }}</p>
        <ul v-if="item.songlist?.length > 0">
          <li v-for="(song, idx) in item.songlist" :key="idx">{{ song.title }}</li>
        </ul>
      </div>
      <AppSoundWave :size="item.waveSize" />
    </li>
  </transition-group>
</template>

<script>
import { defineComponent, computed } from "vue";
import AppSoundWave from "./AppSoundWave.vue";

export default defineComponent({
  name: "SetList",
  components: { AppSoundWave },
  props: {
    set: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const setItems = computed(() => {
      const simplifiedSet = props.set?.map(s => {
        return {
          description: s.description,
          songlist: s.setlistCollection.items,
          waveSize: s.description ? "s" : false,
        };
      });
      return simplifiedSet;
    });

    return { setItems };
  },
});
</script>
<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
ul {
  margin: 0px !important;
  padding-left: 0px !important;
  list-style-type: none;
  li {
    padding: 0;
  }
}
.block-list {
  display: flex;
  &.lower {
    --grid-row-start: 2;
    --align-default: start;
    --align-alternate: end;
    transform: translateY(calc(100% - 107px));
  }
  & > li {
    flex: 1;

    &:not(&:first-child) {
      margin-left: -10%;
    }
  }
}
.content {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.blockie {
  display: grid;
  grid-template-columns: max-content;
  grid-template-rows: repeat(3, 1fr);
  align-items: var(--align-default, end);

  &:nth-child(odd) {
    align-items: var(--align-alternate, start);
  }
  & > .content {
    width: 100%;
    grid-row: var(--grid-row-start, 1) / span 2;
  }
}
</style>