<template>
  <div class="feedback-form row">
    <div class="col-12">
      <h2>Jouw mening telt!</h2>
      <p>Laat jouw reactie hier achter. De leukste berichten plaatsen wij graag op onze site</p>
    </div>
    <form
      name="feedback-form"
      class="form col-12"
      :class="{ pending: pending }"
      v-on:submit.prevent="onSubmit"
    >
      <input type="hidden" name="form-name" value="feedback-form" />

      <div class="form-group">
        <input
          type="text"
          id="naam"
          name="naam"
          v-model="form.naam"
          size="40"
          class="form-control"
          :class="{ filled: form.naam }"
        /><br />
        <label for="naam">Naam</label>
      </div>

      <div class="form-group">
        <textarea
          id="tiptop"
          name="tiptop"
          v-model="form.tiptop"
          cols="40"
          rows="10"
          class="form-control"
          :class="{ filled: form.tiptop }"
          required
        ></textarea
        ><br />
        <label for="tiptop">Bericht</label>
      </div>
      <div data-netlify-recaptcha="true"></div>
      <div class="form-group">
        <input type="submit" value="Verstuur" class="form-submit" />
      </div>
      <small v-if="response.message"
        ><i>{{ response.message }}</i></small
      >
    </form>
  </div>
</template>
<script>
import { useFeedback } from '@/composables/useFeedback';
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'FeedbackForm',

  setup() {
    const pending = ref(false);
    const cleanForm = {
      naam: null,
      tiptop: null,
    };
    const form = reactive({
      ...cleanForm,
    });
    const response = reactive({
      status: null,
      message: null,
    });
    const { sendFeedbackForm } = useFeedback();
    const onSuccessFulSubmit = () => {
      pending.value = true;
      response.message = 'Jouw feedback is verstuurd';
      setTimeout(() => {
        Object.assign(form, cleanForm);
        pending.value = false;
        response.message = null;
      }, 4000);
    };

    const onSubmit = async () => {
      await sendFeedbackForm(form);
      onSuccessFulSubmit();
    };

    return { form, onSubmit, response, pending };
  },
});
</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}
.form {
  margin-bottom: 4rem;
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
