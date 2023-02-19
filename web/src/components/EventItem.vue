<template>
  <li>
    <div class="list-item__content row">
      <div class="list-item__figure col-3">
        <p class="list-item__meta">{{ event.date }}</p>
      </div>

      <div class="list-item__details col-9">
        <h3 class="list-item__title">{{ event.title }}</h3>
        <p class="list-item__meta">{{ event.venue }}</p>
        <p class="list-item__meta">{{ event.description }}</p>
      </div>
    </div>
  </li>
</template>
<script>
export default {
  name: 'EventItem',
  props: {
    event: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
