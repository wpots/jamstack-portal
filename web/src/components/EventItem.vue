<template>
  <li>
    <div class="event list-item__content row">
      <div class="event-meta col-auto">
        <div class="date">
          <div class="day">{{ formattedDate.date.day }}</div>
          <div class="month">{{ formattedDate.date.month }}</div>
          <svg class="date__icon"><use href="#icon-date"></use></svg>
        </div>
      </div>
      <div class="list-item__details col">
        <h3 class="list-item__title">{{ event.title }}</h3>
        <p v-if="event.venue" class="location">
          <svg class="location__icon"><use href="#icon-map-marker"></use></svg>{{ event.venue }}
        </p>
      </div>
      <div class="col-auto align-self-end">
        <button
          @click="showDetails = !showDetails"
          type="button"
          class="btn btn--round"
          :class="showDetails ? 'focus' : null"
        >
          <svg class="info__icon"><use href="#icon-info"></use></svg>
          <span class="sr-only">toggle details</span>
        </button>
      </div>

      <div v-if="showDetails" class="event-body col-xs-12">
        <p>{{ event.description }}</p>
      </div>
    </div>
  </li>
</template>
<script>
import { defineComponent, computed, ref } from 'vue';

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
        new Intl.DateTimeFormat('nl-NL', { month: 'short' })
          .format(date.value)
          .replace('.', '')
          .toUpperCase(),
        new Intl.DateTimeFormat('nl-NL', { day: 'numeric' }).format(date.value),
        new Intl.DateTimeFormat('nl-NL', { year: 'numeric' }).format(date.value),
      ];
      const time = new Intl.DateTimeFormat('nl-NL', { hour: 'numeric', minute: 'numeric' }).format(
        date.value,
      );
      return {
        date: { year, month, day },
        time,
      };
    });

    const showDetails = ref(false);

    return { formattedDate, showDetails };
  },
});
</script>
<style lang="scss" scoped>
.event {
  padding-top: 1rem;
  border: 1px solid $smoke;
  background-color: white !important;
}
.list-item__details {
  align-content: center;
  padding-left: 0;
  background-color: white;
}
.event-meta {
  margin-bottom: 1rem;
}
.event-body {
  padding: 1rem;
}
.date {
  position: relative;
  font-family: 'Muli';
  width: 4rem;
  height: 4rem;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  text-align: center;
  z-index: 0;
  > * {
    margin: 0;
    line-height: 1;
  }

  .date__icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    fill: $smoke;
  }
  .month {
  }
  .day {
    font-size: 2em;
  }
}

.location__icon {
  width: 32px;
  height: 32px;
  fill: $smoke;
  display: inline-block;
}
.btn--round {
  --toggle-btn-color: #{$tundora};
  color: var(--toggle-btn-color);
  width: 2rem;
  height: 2rem;
  padding: 0.3rem;
  margin-bottom: 1rem;
  border-radius: 50%;
  border: 1px solid var(--toggle-btn-color);

  &:hover {
    border-width: 2px;
  }
}
.info__icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
