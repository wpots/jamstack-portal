<template>
  <main class="sections sections--blank">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BlankLayout',
});
</script>

<style lang="scss" scoped>
.sections--blank {
  min-height: 100vh;
}
</style>
