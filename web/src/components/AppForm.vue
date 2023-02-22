<template>
  <form :name="cms.naam" class="form" :class="{ pending: pending }" v-on:submit.prevent="onSubmit">
    <input type="hidden" name="form-name" :value="cms.naam" />

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
        required
      /><br />
      <label :for="uniqueId('email')">E-mail</label>
    </div>
    <div class="form-group">
      <input
        type="text"
        :id="uniqueId('subject')"
        name="subject"
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
        name="message"
        v-model="form.message"
        cols="40"
        rows="10"
        class="form-control"
        :class="{ filled: form.message }"
        required
      ></textarea
      ><br />
      <label :for="uniqueId('message')">Bericht</label>
    </div>
    <div data-netlify-recaptcha="true"></div>
    <div class="form-group">
      <input type="submit" value="Verstuur" class="form-submit" />
    </div>
    <small v-if="response.message"
      ><i>{{ response.message }}</i></small
    >
  </form>
</template>
<script>
import { computed, defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "AppForm",
  props: {
    cms: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const pending = ref(false);
    const cleanForm = {
      naam: null,
      email: null,
      subject: null,
      message: null,
    };
    const form = reactive({
      "form-name": props.cms.naam,
      formId: props.cms.sys.id,
      ...cleanForm,
    });
    const response = reactive({
      status: null,
      message: null,
    });

    const uniqueId = computed(() => field => {
      return `${props.cms.naam}-${field}`;
    });
    // const encode = (data) => {
    //   return Object.keys(data)
    //     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    //     .join('&');
    // };

    const onSuccessFulSubmit = () => {
      pending.value = true;
      response.message = "Form successfully submitted";
      setTimeout(() => {
        Object.assign(form, cleanForm);
        pending.value = false;
        response.message = null;
      }, 4000);
    };
    const onSubmit = () => {
      fetch("/api/v1/mail", {
        method: "POST",
        body: JSON.stringify(form),
      })
        .then(() => {
          onSuccessFulSubmit();
        })
        .catch(error => alert(error));
    };
    return { form, uniqueId, onSubmit, response, pending };
  },
});
</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}

.pending {
  pointer-events: none;
  .form-group {
    opacity: 0.3;
    transition: 0.2s ease-out;
  }
}
small {
  padding: 2rem;
}
</style>
