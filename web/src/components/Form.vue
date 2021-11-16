<template>
  <form
    :name="cms.naam"
    class="form"
    netlify
    netlify-honeypot="bot-field"
    v-on:submit.prevent="onSubmit"
  >
    <input type="hidden" name="form-name" :value="cms.naam" />
    <p class="hidden">
      <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
    </p>
    <div class="form-group">
      <input
        type="text"
        :id="uniqueId('naam')"
        name="naam"
        v-model="form.naam"
        size="40"
        class="form-control"
        :class="{ filled: form.naam }"
      /><br />
      <label :for="uniqueId('naam')">Naam</label>
    </div>
    <div class="form-group">
      <input
        type="email"
        :id="uniqueId('email')"
        name="email"
        v-model="form.email"
        size="40"
        class="form-control"
        :class="{ filled: form.email }"
        aria-required="true"
      /><br />
      <label :for="uniqueId('email')">E-mail</label>
    </div>
    <div class="form-group">
      <input
        type="text"
        :id="uniqueId('subject')"
        name="your-subject"
        v-model="form.subject"
        size="40"
        class="form-control"
        :class="{ filled: form.subject }"
      /><br />
      <label :for="uniqueId('subject')">Onderwerp</label>
    </div>

    <div class="form-group">
      <textarea
        :id="uniqueId('message')"
        name="your-message"
        v-model="form.message"
        cols="40"
        rows="10"
        class="form-control"
        :class="{ filled: form.message }"
      ></textarea
      ><br />
      <label :for="uniqueId('message')">Bericht</label>
    </div>
    <div data-netlify-recaptcha="true"></div>
    <div class="form-group">
      <input type="submit" value="Verstuur" class="form-submit" />
    </div>
  </form>
</template>
<script>
import { computed, defineComponent, reactive } from 'vue';

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
  setup(props) {
    const form = reactive({
      'form-name': props.cms.naam,
      naam: null,
      email: null,
      subject: null,
      message: null,
    });
    const response = reactive({
      status: null,
      message: null,
    });

    const uniqueId = computed(() => (field) => {
      return `${props.cms.naam}-${field}`;
    });
    const encode = (data) => {
      return Object.keys(data)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');
    };
    const onSubmit = () => {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: encode(form),
      })
        .then(() => (response.message = 'Form successfully submitted'))
        .catch((error) => alert(error));
    };
    return { form, uniqueId, onSubmit, response };
  },
});
</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
