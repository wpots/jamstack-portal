<template>
  <div id="quotes" class="section section--quotes">
    <div class="quotes">
      <section class="slick-initialized slick-slider" data-carousel="">
        <div aria-live="polite" class="slick-list">
          <div
            class="slick-track"
            style="opacity: 1; width: 2400px; transform: translate3d(-600px, 0px, 0px);"
            role="listbox"
          >
            <div
              class="quote slick-slide slick-cloned"
              data-slick-index="-1"
              id=""
              aria-hidden="true"
              style="width: 600px;"
              tabindex="-1"
            >
              <div class="quote__item">
                <q>Wij hebben van jullie genoten!</q>
                <div class="quote__origin">Flevo's mannen koor</div>
              </div>
            </div>
            <div
              class="quote slick-slide slick-current slick-active"
              data-slick-index="0"
              aria-hidden="false"
              style="width: 600px;"
              tabindex="-1"
              role="option"
              aria-describedby="slick-slide00"
            >
              <div class="quote__item">
                <q>Fantastisch, een optreden vol energie.</q>
                <div class="quote__origin">Herman O.</div>
              </div>
            </div>
            <div
              class="quote slick-slide"
              data-slick-index="1"
              aria-hidden="true"
              style="width: 600px;"
              tabindex="-1"
              role="option"
              aria-describedby="slick-slide01"
            >
              <div class="quote__item">
                <q>Wij hebben van jullie genoten!</q>
                <div class="quote__origin">Flevo's mannen koor</div>
              </div>
            </div>
            <div
              class="quote slick-slide slick-cloned"
              data-slick-index="2"
              id=""
              aria-hidden="true"
              style="width: 600px;"
              tabindex="-1"
            >
              <div class="quote__item">
                <q>Fantastisch, een optreden vol energie.</q>
                <div class="quote__origin">Herman O.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <picture>
      <source
        srcset="http://www.goedgebekt.com/core/wp-content/uploads/2016/11/gg_portrait.jpg"
        type="image/jpeg"
        media="(orientation:portrait)"
      />

      <img
        class="bg-img"
        src="http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-300x200.jpg"
        srcset="
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1.jpg          3108w,
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-300x200.jpg   300w,
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-768x512.jpg   768w,
          http://www.goedgebekt.com/core/wp-content/uploads/2016/12/GG_2016_1-1024x683.jpg 1024w
        "
        sizes="(max-width: 3108px) 100vw, 3108px"
      />
    </picture>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuoteBlock',
});
</script>
