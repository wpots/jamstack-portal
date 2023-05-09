<template>
  <transition-group class="block-list" name="flow-in" tag="ul">
    <li v-for="(item, index) in setItems" class="blockie" :key="index">
      <div class="content">
        <p v-if="item.description">{{ item.description }}</p>
        <ul v-if="item.songlist?.length > 0" class="songlist">
          <li
            v-for="(song, idx) in item.songlist"
            class="song--rated"
            :key="idx"
            @click="e => handleSongModalClick(e)"
          >
            <span> {{ song.title }}</span>
            <span class="rating">
              <svg class="icon-heart"><use href="#icon-heart"></use></svg>
              <svg class="icon-heart"><use href="#icon-heart"></use></svg>
              <svg class="icon-heart"><use href="#icon-heart"></use></svg>
              <svg class="icon-heart"><use href="#icon-heart"></use></svg>
              <svg class="icon-heart"><use href="#icon-heart"></use></svg>
            </span>
          </li>
        </ul>
      </div>
      <dialog ref="modal">
        <h4>{{ selectedSong }}</h4>
        <span class="rating">
          <svg class="icon-heart"><use href="#icon-heart"></use></svg>
          <svg class="icon-heart"><use href="#icon-heart"></use></svg>
          <svg class="icon-heart"><use href="#icon-heart"></use></svg>
          <svg class="icon-heart"><use href="#icon-heart"></use></svg>
          <svg class="icon-heart"><use href="#icon-heart"></use></svg>
        </span>
        <button type="dismiss">annuleer</button><button type="submit">verstuur</button>
      </dialog>
      <AppSoundWave :size="item.waveSize" class="soundwave-element" />
    </li>
  </transition-group>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
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
    const modal = ref(null);
    const selectedSong = ref(null);
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

    const handleSongRatingClick = () => {
      console.log("clicked");
    };
    const handleSongModalClick = e => {
      console.log("clicked", e);
    };

    return { setItems, selectedSong, handleSongRatingClick, handleSongModalClick, modal };
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
    // --grid-row-start: 2;
    // --align-default: start;
    // --align-alternate: end;
    // transform: translateY(calc(100% - 107px));
  }
  & > li {
    flex: 1;

    &:not(&:first-child) {
      margin-left: -10%;
      .content {
        transform: translateY(5%);
      }
    }
  }
}
.content {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
  &:active,
  &:focus {
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  }
}

.blockie {
  --wave-count: 0;
  display: grid;
  grid-template-columns: max-content;
  grid-template-rows: repeat(3, 1fr);
  align-items: var(--align-default, end);
  padding: 0 2rem;

  &:nth-child(odd) {
    align-items: var(--align-alternate, start);
  }
  & > .content {
    width: 100%;
    grid-row: var(--grid-row-start, 1) / span 2;
  }
}
.songlist {
  list-style-type: initial;
}
.song--rated {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  &:not(&:last-child) {
    border-bottom: 1px solid $smoke;
  }
}
.rating {
  margin-left: 1rem;
}
.icon-heart {
  fill: $smoke;
  width: 1rem;
  height: 1rem;

  &.love {
    fill: $magenta;
  }
}
</style>
