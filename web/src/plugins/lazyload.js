/* eslint-disable */
export default {
  install: (app) => {
    const { userAgent } = window.navigator;
    const isIe = userAgent.match(/Trident/g);

    function initialized(elem) {
      elem.classList.add('initialized');
      elem.dispatchEvent(new CustomEvent('lazyload'));
    }

    const intersectAction = (entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initialized(entry.target);
          self.unobserve(entry.target);
        }
      });
    };

    const config = {
      rootMargin: '200px 0px 200px 0px',
      threshold: 0,
    };

    const observer = !isIe ? new IntersectionObserver(intersectAction, config) : false;

    // use v-lazyload on component
    app.directive('lazyload', {
      mounted(el, binding) {
        if (observer) observer.observe(el);
        const callback = binding.value;
        el.addEventListener('lazyload', (e) => {
          callback();
        });
      },
      upMounted(el) {
        el.removeEventListener('lazyload');
      },
    });
  },
};
/* REFACTOR: https://logaretm.com/blog/type-safe-provide-inject/ */
