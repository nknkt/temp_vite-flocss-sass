/* eslint-disable */
import ElementCoordinate from './_ElementCoordinate.js';

const defaultConfig = {
  headerSelector: '#js-header',
  anchorSelector: 'a[href^="#"]',
};

// Object.assign を使用してオブジェクトをマージ
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default class AnchorScroll {
  constructor(config) {
    this.config = deepMerge({}, defaultConfig, config || {});
    this.scrollRoot = 'scrollingElement' in document ? document.scrollingElement : document.documentElement;
    this.headerElement = document.querySelector(this.config.headerSelector);
  this.targetElement = document.querySelectorAll(this.config.anchorSelector);
  }

  init() {
    this._handleEvent();
  }

  animation(targetElement) {
    if (targetElement) {
      const targetCoordinate = new ElementCoordinate(targetElement);

      // anime.jsの代わりにネイティブスクロールを使用
      this.scrollRoot.scrollTo({
        top: targetCoordinate.y,
        behavior: 'smooth',
      });
    }
  }

  _handleEvent() {
    window.addEventListener('load', e => {
      const hash = location.hash;
      const targetElement = hash !== '' ? document.querySelector(location.hash) : null;

      if (targetElement) {
        this.animation(targetElement);
      }
    });

    Array.from(this.targetElement).forEach(el => {
      el &&
        el.addEventListener(
          'click',
          e => {
            e.preventDefault();
            const hrefAttr = e.currentTarget.getAttribute('href');
            if (hrefAttr) {
              if (hrefAttr === '#') {
                // #のみの場合はページトップへ
                this.scrollRoot.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              // #以降のIDだけ抽出
              const targetHash = hrefAttr.replace(/^.*#/, '');
              const targetSelector = `#${targetHash}`;
              const targetElement = targetSelector ? document.querySelector(targetSelector) : null;
              if (targetElement) {
                this.animation(targetElement);
              }
            }
          },
          false
        );
    });
  }
}
