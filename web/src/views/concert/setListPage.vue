<template>
  <div class="timeline">
    <div class="sound-wave">
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
    <div class="sound-wave small">
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
      <div class="line"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SetListPage",
});
</script>
<style lang="scss" scoped>
.timeline {
  margin: 2rem;
  display: flex;
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
  &::before,
  &::after {
    content: "";
    display: block;
    width: 4px;
    height: var(--wave-height, 3px);
    background-color: black;
    margin-left: 1px;
    border-radius: 0 0 2px 2px;
    opacity: 0.6;
  }
  &::before {
    transform: scaleY(-1);
    opacity: 0.3;
    margin-bottom: 1px;
  }
}
.wave {
  @extend .line;

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
