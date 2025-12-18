/**
 * アンカースクロール
 * CSSの scroll-behavior と scroll-padding-top を活用
 */
export default class AnchorScroll {
  constructor(selector = 'a[href^="#"]') {
    this.links = document.querySelectorAll(selector);
    this.lastHash = '';
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener(
        'click',
        e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          const href = link.getAttribute('href');

          // 同じリンクを連続クリックした場合は無視
          if (href === this.lastHash) return;

          this.lastHash = href;

          // ページトップへ
          if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }

          // ターゲット要素にスクロール
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        },
        { capture: true },
      );
    });

    // ページ読み込み時のハッシュ対応
    if (location.hash) {
      setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          this.lastHash = location.hash;
        }
      }, 100);
    }
  }
}
