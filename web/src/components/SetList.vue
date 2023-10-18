<template>
  <transition-group class="block-list" name="flow-in" tag="ul">
    <li v-for="(item, index) in setItems" class="songset" :key="index">
      <ul v-if="item.songlist?.length > 0" class="songlist">
        <AppRatingItem v-for="(song, idx) in item.songlist" :key="idx" :song="song" />
      </ul>
      <p v-else-if="item.description" class="content">{{ item.description }}</p>
      <AppSoundWave v-if="item.description" :size="item.waveSize" class="soundwave-element" />
      <div v-else class="soundwave-set">
        <AppSoundWave
          v-for="(song, idx) in item.songlist"
          :key="idx"
          :size="item.waveSize"
          class="soundwave-element"
        />
      </div>
    </li>
  </transition-group>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import AppRatingItem from './AppRatingItem.vue';
import AppSoundWave from './AppSoundWave.vue';

export default defineComponent({
  name: 'SetList',
  components: { AppSoundWave, AppRatingItem },
  props: {
    set: {
      type: Array,
      default: () => ([]),
    },
  },
  setup(props) {
    const selectedSong = ref(null);
    const setItems = computed(() => {
      const simplifiedSet = props.set?.map(s => {
        return {
          description: s.short,
          songlist: s.scoresListCollection.items,
          waveSize: s.short ? 's' : false,
        };
      });
      return simplifiedSet;
    });

    return { setItems, selectedSong };
  },
});
</script>
<style lang="scss">
p {
  margin-bottom: 0;
}

.block-list {
  margin: 0px !important;
  padding-left: 0px !important;
  list-style-type: none;
  display: flex;

  & > li {
    flex: 1;
  }
}

.songset {
  --wave-count: 0;
  display: grid;
  grid-template-columns: max-content;
  grid-template-rows: repeat(2, 1fr);
  align-items: var(--align-default, end);
  padding: 0 2rem;

  &:nth-child(odd) {
    align-items: var(--align-alternate, start);
  }

  h4 {
    font-size: 1em;
    margin-bottom: 0;
  }
  & > .content {
    width: 100%;
  }
}

.songlist {
  display: inline-flex;
  align-items: center;
  list-style-type: initial;

  & > li {
    margin-left: -1.5rem;

    &:active,
    &:focus {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    }

    &:nth-of-type(even) {
      margin-top: 5rem;
    }
  }
}

.soundwave-element {
  height: 107px; // same as set
  align-self: start !important;
}

.soundwave-set {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: block;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>
