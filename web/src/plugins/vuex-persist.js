import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  reducer: state => ({
    feedback: {
      ...state.feedback,
      allRatings: null,
    },
    content: state.content,
  }),
});

export default vuexLocal;
