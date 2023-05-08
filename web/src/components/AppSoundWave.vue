<template>
  <div v-if="size" ref="elementSmall" class="timeline">
    <div class="sound-wave">
      <div class="line"></div>
    </div>
    <div class="sound-wave small">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>

    <div class="sound-wave small reverse">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    <div class="sound-wave">
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
  <div v-else ref="element" class="timeline">
    <div class="sound-wave">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="sound-wave large">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    <div class="sound-wave">
      <div class="line"></div>
    </div>
    <div class="sound-wave small reverse">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    <div class="sound-wave">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppSoundWave",
  props: {
    size: {
      type: [String, Boolean],
      default: false,
    },
    state: {
      type: String,
      default: "paused",
    },
  },
  setup() {
    // do stuff
  },
});
</script>
<style lang="scss" scoped>
.timeline {
  position: relative;
  margin: 0.5rem;
  display: flex;
  align-self: center;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: block;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}
.sound-wave {
  display: flex;
  align-items: center;

  &.large {
    --wave-height: 36px;
    --wave-decline-height: 133px;
  }

  &.small {
    --wave-height: 5px;
    --wave-incline: 2px;
    --wave-decline: 5px;
    --wave-decline-height: 30px;
  }
}

.line {
  color: rgba(0, 0, 0, 0.2);
  &::before,
  &::after {
    content: "";
    display: block;
    width: 6px;
    height: var(--wave-height, 3px);
    background-color: currentColor;
    margin-left: 1px;
    border-radius: 0 0 2px 2px;
    opacity: 0.9;
  }
  &::before {
    transform: scaleY(-1);
    opacity: 0.4;
    margin-bottom: 1px;
  }
}
.wave {
  @extend .line;
  .reverse & {
    @for $i from 1 through 6 {
      &:nth-last-child(#{$i}) {
        &::before,
        &::after {
          height: calc(0px + #{$i} * var(--wave-incline, 7px));
        }
      }
    }
  }

  @for $i from 1 through 6 {
    &:nth-child(#{$i}) {
      &::before,
      &::after {
        height: calc(0px + #{$i} * var(--wave-incline, 7px));
      }
    }
  }

  @for $i from 8 through 13 {
    &:nth-child(#{$i}) {
      &::before,
      &::after {
        height: calc(var(--wave-decline-height, 85px) - #{$i} * var(--wave-decline, 11px));
      }
    }
  }
}
</style>
