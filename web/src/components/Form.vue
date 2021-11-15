<template>
  <form name="ask-question" class="form" netlify netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="ask-question" />
    <p class="hidden">
      <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
    </p>
    <div class="form-group">
      <input
        type="text"
        name="your-name"
        value=""
        size="40"
        class="form-control"
        aria-required="true"
        aria-invalid="false"
      /><br />
      <label class="">Naam</label>
    </div>
    <div class="form-group">
      <input
        type="email"
        name="your-email"
        value=""
        size="40"
        class="form-control"
        aria-required="true"
        aria-invalid="false"
      /><br />
      <label class="">E-mail</label>
    </div>
    <div class="form-group">
      <input
        type="text"
        name="your-subject"
        value=""
        size="40"
        class="form-control"
        aria-invalid="false"
      /><br />
      <label>Onderwerp</label>
    </div>

    <div class="form-group">
      <textarea
        name="your-message"
        cols="40"
        rows="10"
        class="form-control"
        aria-invalid="false"
      ></textarea
      ><br />
      <label>Bericht</label>
    </div>
    <div data-netlify-recaptcha="true"></div>
    <div class="form-group">
      <input type="submit" value="Verstuur" class="form-submit" /><span class="ajax-loader"></span>
    </div>
  </form>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Form',

  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
});
</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
