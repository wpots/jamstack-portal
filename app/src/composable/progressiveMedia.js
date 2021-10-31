// import { ref, computed } from 'vue';
/* eslint-disable */
export default function useProgressiveMedia() {
  const { userAgent } = window.navigator;
  const isIe = userAgent.match(/Trident/g);

  function removeDataAttrs(asset) {
    asset.removeAttribute('data-src');
    asset.removeAttribute('data-srcset');
    asset.removeAttribute('data-sizes');
  }

  function addLoadedClass(image) {
    image.classList.add('loaded');
  }

  function ignoreSrcset() {
    const images = document.querySelectorAll('[data-srcset]');
    images.forEach((image) => {
      image.src = `${image.dataset.src}?${new Date().getTime()}`; // prevent the browser to cache image locally
      removeDataAttrs(image);
      addLoadedClass(image);
    });
  }

  function preloadImage(lazyFigure) {
    const assets = lazyFigure.querySelectorAll('[data-srcset]');
    assets.forEach((asset) => {
      asset.srcset = asset.dataset.srcset;
      asset.onload = addLoadedClass(lazyFigure);
      removeDataAttrs(asset);
    });
  }

  const intersectAction = (entries, self) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        preloadImage(target);
        self.unobserve(target);
      }
    });
  };

  const config = {
    rootMargin: '200px 0px 200px 0px',
    threshold: 0,
  };

  const AssetObserver = {
    observer: !isIe ? new IntersectionObserver(intersectAction, config) : false,
    useFallback: isIe ? ignoreSrcset : false,
  };

  return AssetObserver;
}
