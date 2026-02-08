<template>
  <h2>{{ heading }}</h2>
  <div class="members">
    <div v-for="(memberList, index) in memberLists" class="member-list" :key="index">
      <MemberItem
        v-for="(member, idx) in memberList"
        :member="member"
        :key="idx + index"
        :idx="idx + Math.random(1, 9)"
        :class="getClass(idx, member.range)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

import MemberItem, { MemberType } from '@/components/MemberItem.vue';

export default defineComponent({
  components: { MemberItem },
  props: {
    members: {
      type: Array as PropType<MemberType[]>,
      default: () => {
        [];
      },
    },
  },
  setup(props) {
    const heading = computed(() => 'De leden');

    const classes = [' blend-pink', ' blend-red', ' blend-yellow', ' blend-green'];

    const memberLists = computed(() => {
      const separatedLists: Record<string, MemberType[]> = {};
      props.members.forEach(member => {
        const val = member.range;
        if (!(val in separatedLists)) {
          separatedLists[val] = [];
        }
        separatedLists[val].push(member);
      });
      return Object.values(separatedLists);
    });

    const getClass = (index: number, range: string) => {
      const classIndex = index % classes.length;
      return range + classes[classIndex];
    };
    return { heading, getClass, memberLists };
  },
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/common/variables" as *;
@use "@/assets/styles/common/mixins" as *;
.members,
.member-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
</style>
