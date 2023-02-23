/* eslint-disable */
export default {
  install: app => {
    const { userAgent } = window.navigator;
    const isIe = userAgent.match(/Trident/g);

    let previousY = 0;
    let previousRatio = 0;

    function watching(entry) {
      entry.target.classList.add("initialized");
      const currentY = entry.boundingClientRect.y;
      const currentRatio = entry.intersectionRatio;
      const direction = currentY < previousY ? "down" : "up";
      // const ratio = currentRatio > previousRatio ? 'enter' : 'leave';
      entry.target.dispatchEvent(
        new CustomEvent("lazyload", { detail: { direction, ratio: currentRatio } }),
      );
      previousY = currentY;
      previousRatio = currentRatio;
    }

    let observer;
    const config = settings => {
      return {
        root: null,
        rootMargin: settings?.margin || "200px 0px 200px 0px",
        threshold: settings?.threshold || 0.1,
      };
    };

    // use v-lazyload on component
    app.directive("lazyload", {
      mounted(el, binding) {
        const { callback, settings, persist } = binding.value;
        observer = !isIe
          ? new IntersectionObserver((entries, self) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  watching(entry);
                  if (!persist) {
                    self.unobserve(entry.target);
                  }
                }
              });
            }, config(settings))
          : false;
        if (observer) observer.observe(el);
        el.addEventListener("lazyload", e => {
          if (callback) callback(e.detail);
        });
      },
      unMounted(el) {
        el.removeEventListener("lazyload");
        if (persist) observer.unobserve(el);
      },
    });
  },
};
/* REFACTOR: https://logaretm.com/blog/type-safe-provide-inject/ */
