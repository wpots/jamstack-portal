<template>
  <li>
    <div class="list-item__content row">
      <div class="list-item__figure col-3">
        <div>
          <span class="">{{ formattedDate.date.year }}</span>
        </div>
        <div>
          <span class="">{{ formattedDate.date.month }}</span>
          <span class="">{{ formattedDate.date.day }}</span>
        </div>
        <div>
          <span class="">{{ formattedDate.time.hours }}</span
          >:
          <span class="">{{ formattedDate.time.minutes }}</span>
        </div>
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
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'EventItem',
  props: {
    event: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const date = computed(() => new Date(props.event.date));
    const formattedDate = computed(() => {
      const [month, day, year] = [
        new Intl.DateTimeFormat('nl-NL', { month: 'long' }).format(date.value),
        new Intl.DateTimeFormat('nl-NL', { day: 'numeric' }).format(date.value),
        new Intl.DateTimeFormat('nl-NL', { year: 'numeric' }).format(date.value),
      ];
      const [hours, minutes] = [
        new Intl.DateTimeFormat('nl-NL', { hour: 'numeric' }).format(date.value),
        new Intl.DateTimeFormat('nl-NL', { minutes: 'numeric' }).format(date.value),
      ];
      return {
        date: { year, month, day },
        time: { hours, minutes },
      };
    });

    return { formattedDate };
  },
});
</script>
<style lang="scss" scoped></style>
