<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Concert Feedback</h1>
        <h2>Stemmen op het Repertoire</h2>

        <section v-if="performedSongs.length" class="feedback-songs">
          <h3>Ons repertoire</h3>
          <p class="feedback-note">
            Deze nummers staan in ons repertoire en zijn op het concert gezongen. Beoordelingen
            tellen mee voor onze uitvoering.
          </p>
          <RepertoirList :performed-by-us="true" :songs="performedSongs" :show-ratings="true" />
        </section>

        <section v-if="referenceSongs.length" class="feedback-songs feedback-songs--reference">
          <h3>Overige stemmen</h3>
          <p class="feedback-note">
            Deze nummers stonden op het programma maar staan niet in ons repertoire. Stemmen hierop
            worden apart opgeslagen en tellen niet mee in onze uitvoeringsscore.
          </p>
          <RepertoirList :performed-by-us="false" :songs="referenceSongs" :show-ratings="true" />
        </section>

        <p v-if="!performedSongs.length && !referenceSongs.length">
          Geen nummers gevonden voor dit concert.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h2>Open feedback</h2>

        <div v-if="openFeedback.length" class="list__items feedback-open-list">
          <ul class="list list--figure row flow-in">
            <EventItem
              v-for="entry in openFeedback"
              :key="entry.id"
              class="list__item flow-item col-xs-12"
              :event="toEventCard(entry)"
            />
          </ul>
        </div>
        <div v-else>
          <p>Geen open feedback gevonden voor dit concert.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useContent } from '@/composables/useContent';
import { useFeedback } from '@/composables/useFeedback';
import {
  getOpenFeedbackWindow,
  isEntryInOpenFeedbackWindow,
} from '@/composables/useFeedback/availability';
import { getProgramSongLists } from '@/composables/useFeedback/programSongLists';
import type { FeedbackEntry } from '@/composables/useFeedback';
import EventItem from '@/components/EventItem.vue';
import RepertoirList from '@/components/RepertoirList.vue';

export default defineComponent({
  components: { EventItem, RepertoirList },
  name: 'FeedbackPage',
  setup() {
    const route = useRoute();
    const { getSongs, fetchSongs, getTimeTable } = useContent('timetable', { route });
    const { fetchSongRatings, fetchFeedback, getFeedback } = useFeedback();

    const programSongs = computed(() => {
      const programItems = getTimeTable.value?.programItems || [];
      const repertoire = getSongs.value || [];

      return getProgramSongLists(programItems, repertoire);
    });

    const performedSongs = computed(() => programSongs.value.performedSongs);
    const referenceSongs = computed(() => programSongs.value.referenceSongs);

    const openFeedback = computed(() => {
      const all = getFeedback.value || [];
      const concertDateRaw =
        getTimeTable.value && 'concertDatum' in getTimeTable.value
          ? getTimeTable.value.concertDatum
          : undefined;
      const window = getOpenFeedbackWindow(
        typeof concertDateRaw === 'string' ? concertDateRaw : undefined,
      );

      return all.filter(entry =>
        isEntryInOpenFeedbackWindow(entry?.date, window, entry?.updatedAt),
      );
    });

    function toEventCard(entry: FeedbackEntry) {
      const timestamp = entry.date || Date.now();

      return {
        title: entry.tiptop,
        date: new Date(timestamp).toISOString(),
        description: entry.naam || 'Anoniem',
      };
    }

    onMounted(async () => {
      await fetchSongs();
      await fetchSongRatings(getSongs.value || []);
      await fetchFeedback();
    });

    return { performedSongs, referenceSongs, openFeedback, toEventCard };
  },
});
</script>
<style lang="scss">
.feedback-note {
  max-width: 42rem;
}

.feedback-songs {
  margin-bottom: 2.5rem;

  h3 {
    margin-bottom: 0.5rem;
  }
}

.feedback-songs--reference {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.feedback-open-list {
  margin-top: 1rem;

  .list-item__content {
    container-type: inline-size;
    align-items: center;
  }

  .list-item__details {
    min-width: 0;
    align-self: center;
  }

  .list-item__title {
    margin: 0;
    font-size: clamp(12px, 4.5cqi, 1rem) !important;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
  }

  .event-body p {
    margin: 0;
    font-size: clamp(12px, 3.5cqi, 0.95rem);
    line-height: 1.3;
  }
}
</style>
