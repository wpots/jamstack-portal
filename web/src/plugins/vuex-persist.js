import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  reducer: state => ({
    feedback: state.feedback,
    content: state.content,
  }),
});

export default vuexLocal;
