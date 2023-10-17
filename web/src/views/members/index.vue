<template>
  <MemberList :members="members" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MemberList from '@/components/MemberList.vue';

export default defineComponent({
  name: 'MembersPage',
  components: { MemberList },
  setup() {
    const members = [
      // sopranen
      {
        range: 'one',
        name: 'Jacky',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'one',
        name: 'Esther',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'one',
        name: 'Linda',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'one',
        name: 'Suzanne',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      // mezzo
      {
        range: 'two',
        name: 'Tamara',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'two',
        name: 'Joyce',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'two',
        name: 'Helen',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'two',
        name: 'Angelique',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      // hoge alten
      {
        range: 'three',
        name: 'Silvia',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'three',
        name: 'Lorance',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'three',
        name: 'Cordina',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'three',
        name: 'Celeste',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      // lage alten
      {
        range: 'alt',
        name: 'Petra',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'alt',
        name: 'Karen',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'alt',
        name: 'Anneke',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
      {
        range: 'alt',
        name: 'Wieteke',
        motto: 'WYSIWYG',
        bio: 'Jong, rijk, succesvol',
        avatar: 'https://loremflickr.com/600/600',
      },
    ];

    return { members };
  },
});
</script>
