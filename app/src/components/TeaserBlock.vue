<template>
  <div id="het-koor" class="section section--het-koor" data-anchor="het-koor">
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
          <div class="img--framed">
            <div class="content">
              <img
                class="img--round"
                src="/core/wp-content/uploads/2016/06/IMG_2017_sq-150x150.jpg"
                srcset="
                  /core/wp-content/uploads/2016/06/IMG_2017_sq.jpg           2336w,
                  /core/wp-content/uploads/2016/06/IMG_2017_sq-150x150.jpg    150w,
                  /core/wp-content/uploads/2016/06/IMG_2017_sq-300x300.jpg    300w,
                  /core/wp-content/uploads/2016/06/IMG_2017_sq-768x768.jpg    768w,
                  /core/wp-content/uploads/2016/06/IMG_2017_sq-1024x1024.jpg 1024w
                "
                sizes="(max-width: 2336px) 100vw, 2336px"
              />
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="43%"
              cy="42%"
              r="36%"
              fill="#EB008B"
              data-animate="rotateIn"
              class=""
              style="opacity: 1;"
            ></circle>
            <circle
              cx="58%"
              cy="41%"
              r="33%"
              fill="#fe265e"
              data-animate="rotateIn"
              class=""
              style="opacity: 1;"
            ></circle>
            <circle
              cx="45%"
              cy="60%"
              r="34%"
              fill="#3beca8"
              data-animate="rotateIn"
              class=""
              style="opacity: 1;"
            ></circle>
            <circle
              cx="58%"
              cy="60%"
              r="32%"
              fill="#a9f946"
              data-animate="rotateIn"
              class=""
              style="opacity: 1;"
            ></circle>
          </svg>
        </div>
      </article>
    </div>

    <div class="spacer"></div>
    <picture>
      <source
        srcset="http://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg"
        type="image/jpeg"
        media="(orientation:portrait)"
      />
      <!-- herte -->

      <img
        class="bg-img"
        src="/core/wp-content/uploads/2016/06/IMG_2028-300x200.jpg"
        srcset="
          /core/wp-content/uploads/2016/06/IMG_2028.jpg          3504w,
          /core/wp-content/uploads/2016/06/IMG_2028-300x200.jpg   300w,
          /core/wp-content/uploads/2016/06/IMG_2028-768x512.jpg   768w,
          /core/wp-content/uploads/2016/06/IMG_2028-1024x683.jpg 1024w
        "
        sizes="(max-width: 3504px) 100vw, 3504px"
        style="position: fixed;"
      />
    </picture>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TeaserBlock',
});
</script>
