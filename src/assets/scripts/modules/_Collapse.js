// lodashの代わりにネイティブ関数を使用
function defaults(target, defaultObj) {
  return Object.assign({}, defaultObj, target);
}

function forEach(collection, callback) {
  if (Array.isArray(collection) || collection instanceof NodeList) {
    Array.from(collection).forEach(callback);
  } else if (typeof collection === 'object') {
    for (const key in collection) {
      if (Object.prototype.hasOwnProperty.call(collection, key)) {
        callback(collection[key], key);
      }
    }
  }
}

const defaultOptions = {
  transitionDuration: '0.35s',
  transitionTimingFunction: 'ease',
  containerActiveClass: 'is-expanded',
  hashNavigation: false,
};

export default class Collapse {
  constructor(togglerEl, options) {
    this.togglerEl = togglerEl;
    this.options = defaults(options || {}, defaultOptions);
    this.mql = window.matchMedia('only screen and (max-width: 767px)');
  }

  init() {
    // ターゲット要素を取得する
    this.targetEl =
      document.getElementById(this.togglerEl.getAttribute('aria-controls')) || this.togglerEl.nextElementSibling;

    // 閉じるトリガー要素を取得する
    this.collapseEls = this.targetEl.querySelectorAll('[data-collapse]');

    // トグラー要素に click イベントのリスナーを設定する
    this.togglerEl.addEventListener('click', this.onClick.bind(this));

    // ターゲット要素に transitionend イベントのリスナーを設定する
    this.targetEl.addEventListener('transitionend', this.onTransitionEnd.bind(this));

    // 閉じるトリガー要素に click イベントのリスナーを設定する
    forEach(this.collapseEls, el => {
      el.addEventListener('click', this.onClickCollapse.bind(this));
    });

    // DOM の変更を検知するオブザーバーを生成する
    this.mutationObserver = new MutationObserver(this.onMutate.bind(this));

    // ターゲット要素の open 属性の変更を監視する
    this.mutationObserver.observe(this.targetEl, {
      attributes: true,
      attributeFilter: ['open'],
    });

    // ターゲット要素のスタイルを設定する
    if (!this.isExpanded) {
      this.targetEl.style.display = 'none';
      this.targetEl.style.overflow = 'hidden';
      this.targetEl.style.height = '0';
      this.targetEl.style.visibility = 'hidden';
    }

    // ARIA 属性を設定する
    this.updateAriaAttributes();

    // hashNavigation オプションが有効な場合
    if (this.options.hashNavigation) {
      const fragmentIdentifier = window.location.hash.substring(1);

      // トグラー要素またはターゲット要素の ID とフラグメント識別子が一致する場合
      if (
        fragmentIdentifier &&
        (this.togglerEl.id === fragmentIdentifier ||
          this.togglerEl.getAttribute('aria-controls') === fragmentIdentifier)
      ) {
        if (!this.isExpanded) {
          this.isExpanded = true;

          // リソースの読み込みを待ってから、即座にターゲット要素を開く
          window.addEventListener('load', e => {
            this.expand();
            this.onTransitionEnd();
          });
        }
      }
    }
  }

  get isExpanded() {
    return this.targetEl.hasAttribute('open');
  }

  set isExpanded(val) {
    if (val) {
      this.targetEl.setAttribute('open', '');
    } else {
      this.targetEl.removeAttribute('open');
    }
  }

  expand() {
    this.targetEl.style.display = '';
    this.targetEl.style.visibility = '';
    this.targetEl.style.height = `${this.targetEl.scrollHeight}px`;
    this.targetEl.style.transition = `height ${
      this.options.transitionDuration
    } ${this.options.transitionTimingFunction}`;

    this.updateAriaAttributes();
  }

  collapse() {
    this.targetEl.style.height = `${this.targetEl.scrollHeight}px`;

    this.targetEl.scrollHeight; // reflow を強制する
    this.targetEl.style.overflow = 'hidden';
    this.targetEl.style.height = '0';
    this.targetEl.style.transition = `height ${
      this.options.transitionDuration
    } ${this.options.transitionTimingFunction}`;

    this.updateAriaAttributes();
  }

  updateAriaAttributes() {
    this.togglerEl.setAttribute('aria-expanded', this.isExpanded.toString());
    this.targetEl.setAttribute('aria-hidden', (!this.isExpanded).toString());
  }

  onClick(e) {
    // TransitionEvent のリスナーとの干渉を避けるため window.requestAnimationFrame() で実行タイミングを制御する
    window.requestAnimationFrame(() => {
      this.isExpanded = !this.isExpanded;
    });
  }

  onClickCollapse(e) {
    // TransitionEvent のリスナーとの干渉を避けるため window.requestAnimationFrame() で実行タイミングを制御する
    window.requestAnimationFrame(() => {
      this.isExpanded = false;
    });
  }

  onTransitionEnd(e) {
    this.targetEl.style.transition = '';

    if (this.isExpanded) {
      this.targetEl.style.overflow = '';
      this.targetEl.style.height = '';
    } else {
      this.targetEl.style.display = 'none';
      this.targetEl.style.visibility = 'hidden';
    }
  }

  onMutate(records) {
    records.forEach(record => {
      if (this.isExpanded) {
        this.expand();
      } else {
        this.collapse();
      }
    });
  }
}
