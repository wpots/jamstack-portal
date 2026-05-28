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

      <div class="hidden" aria-hidden="true">
        <label for="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          v-model="form.website"
          tabindex="-1"
          autocomplete="off"
          :disabled="pending"
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          id="naam"
          name="naam"
          v-model="form.naam"
          size="40"
          class="form-control"
          :class="{ filled: form.naam }"
          :disabled="pending"
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
          :disabled="pending"
          required
        ></textarea
        ><br />
        <label for="tiptop">Bericht</label>
      </div>
      <div data-netlify-recaptcha="true"></div>
      <div class="form-group">
        <input type="submit" value="Verstuur" class="form-submit" :disabled="pending" />
      </div>
      <small v-if="response.message" :class="response.status"
        ><i>{{ response.message }}</i></small
      >
    </form>
  </div>
</template>
<script lang="ts">
import { useFeedback } from '@/composables/useFeedback';
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'FeedbackForm',
  emits: ['submitted'],

  setup(_, { emit }) {
    const pending = ref(false);
    const cleanForm = {
      naam: '',
      tiptop: '',
      website: '',
    };
    const form = reactive({
      ...cleanForm,
    });
    const response = reactive({
      status: '',
      message: '',
    });
    const { sendFeedbackForm } = useFeedback();

    const clearResponse = () => {
      response.status = '';
      response.message = '';
    };

    const onSuccessFulSubmit = () => {
      response.status = 'success';
      response.message = 'Jouw feedback is verstuurd';
      setTimeout(() => {
        Object.assign(form, cleanForm);
        clearResponse();
      }, 4000);
    };

    const onSubmit = async () => {
      pending.value = true;
      clearResponse();

      try {
        await sendFeedbackForm(form);
        onSuccessFulSubmit();
        emit('submitted');
      } catch (error) {
        response.status = 'error';
        response.message =
          error instanceof Error ? error.message : 'Versturen is mislukt. Probeer het opnieuw.';
      } finally {
        pending.value = false;
      }
    };

    return { form, onSubmit, response, pending };
  },
});
</script>
<style lang="scss" scoped>
@use '@/assets/styles/common/variables' as *;
@use '@/assets/styles/common/mixins' as *;
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

  &.error {
    color: $red;
  }

  &.success {
    color: $green;
  }
}
</style>
