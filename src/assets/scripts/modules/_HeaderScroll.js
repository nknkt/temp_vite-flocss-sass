/**
 * ヘッダースクロール制御
 */
export default class HeaderScroll {
  /**
   * @param {HTMLElement} header - ヘッダー要素
   * @param {Object} options - オプション
   */
  constructor(header) {
    this.header = header;
    // p-kv要素とロゴ要素を取得
    this.kv = document.querySelector('.p-kv');
    this.logo = this.header.querySelector('.l-header__logo');
  }

  /**
   * 初期化
   */
  init() {
    this.bindEvents();
    // ロゴ内のaタグクリック時にis-activeを外す
    if (this.logo) {
      const aTag = this.logo.querySelector('a');
      if (aTag) {
        aTag.addEventListener('click', () => {
          this.logo.classList.remove('is-active');
        });
      }
    }
  }

  /**
   * イベントバインド
   */
  bindEvents() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * スクロールハンドラー
   */
  handleScroll() {
    const scrollY = window.scrollY;
    // p-kvの範囲から出たらロゴにis-activeを付与/削除
    if (this.kv && this.logo) {
      const kvHeight = this.kv.offsetHeight;
      if (scrollY > kvHeight) {
        this.logo.classList.add('is-active');
      } else {
        this.logo.classList.remove('is-active');
      }
    }
  }

  /**
   * リサイズハンドラー
   */
  handleResize() {
    // リサイズ時に閾値を再計算する場合はここに実装
  }

  /**
   * 破棄
   */
  destroy() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.logo) {
      this.logo.classList.remove('is-active');
    }
  }
}
