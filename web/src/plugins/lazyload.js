/* eslint-disable */
export default {
  install: (app) => {
    const { userAgent } = window.navigator;
    const isIe = userAgent.match(/Trident/g);

    function initialized(image) {
      image.classList.add('initialized');
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
      mounted(el) {
        if (observer) observer.observe(el);
      },
    });
  },
};
/* REFACTOR: https://logaretm.com/blog/type-safe-provide-inject/ */
