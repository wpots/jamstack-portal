<template>
  <div id="het-koor" class="section section--het-koor teaserblock" data-anchor="het-koor">
    <div class="container-fluid">
      <article class="flex-box row" id="content-het-koor">
        <div class="col-sm-6">
          <h1>Het Koor</h1>
          <p>
            <strong>Goed gebekt</strong> is een vierstemmige vocal group onder de bezielende leiding
            van Paul Michèl Tijssen. Ons repertoire bestaat uit moderne popsongs en klassiekers. We
            zingen Nederlands- en Engelstalige nummers, a capella of met pianobegeleiding.
          </p>
          <p>
            <strong>Goed Gebekt</strong> is een groep van 16 vriendinnen met een gedeelde liefde
            voor zingen (en chocolade). We besteden veel aandacht aan hoe we klinken maar ook aan
            expressie en tekstbeleving; onze optredens zijn niet alleen oorstrelend.
          </p>
          <p>
            <strong>Goed Gebekt</strong> is altijd goed voor een verrassend optreden. We wisselen
            extraverte uptempo nummers af met kleine cabaretliedjes in een programma dat je raakt.
          </p>
          <p><em>Laat je verrassen!</em></p>
        </div>

        <div class="img__frame col-sm-6 pull-up">
          <LazyImage :media="getContentMedia" class="inline-img" />
          <svg xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="43%"
              cy="42%"
              r="36%"
              fill="#EB008B"
              data-animate="rotateIn"
              class=""
              style="opacity: 1"
            ></circle>
            <circle
              cx="58%"
              cy="41%"
              r="33%"
              fill="#fe265e"
              data-animate="rotateIn"
              class=""
              style="opacity: 1"
            ></circle>
            <circle
              cx="45%"
              cy="60%"
              r="34%"
              fill="#3beca8"
              data-animate="rotateIn"
              class=""
              style="opacity: 1"
            ></circle>
            <circle
              cx="58%"
              cy="60%"
              r="32%"
              fill="#a9f946"
              data-animate="rotateIn"
              class=""
              style="opacity: 1"
            ></circle>
          </svg>
        </div>
      </article>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import assetQuery from '@/apollo/queries/assetQuery.gql';
import LazyImage from './LazyImage.vue';

export default defineComponent({
  components: { LazyImage },
  name: 'TeaserBlock',
  setup() {
    const { result } = useQuery(assetQuery, { id: '2FY8Pj16TmuVrVCXQ0dop2' });
    const image = useResult(result, null, (data) => data.asset);

    const getContentMedia = computed(() => {
      const landscape = {
        src: image.value?.url,
        alt: image.value?.title,
      };
      return { landscape, classes: 'img--framed contain-center' };
    });

    return { getContentMedia };
  },
});
</script>
