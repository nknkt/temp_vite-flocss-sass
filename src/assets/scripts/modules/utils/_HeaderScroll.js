/**
 * ヘッダースクロール制御
 * - スクロール位置でクラスを追加（背景色・影の切り替え用）
 * - hide-on-scroll機能（下スクロールで非表示、上スクロールで表示）
 */
export default class HeaderScroll {
  /**
   * @param {HTMLElement} header - ヘッダー要素
   * @param {Object} options - オプション
   * @param {number} options.threshold - スクロール位置の閾値（この値を超えたらクラス追加）
   * @param {string} options.scrolledClass - スクロール時に追加するクラス名
   * @param {boolean} options.hideOnScroll - hide-on-scroll機能を有効にするか
   * @param {number} options.hideThreshold - hide判定の最小スクロール位置
   * @param {string} options.hiddenClass - 非表示時に追加するクラス名
   * @param {number} options.hideDelay - スクロール停止後に表示するまでの遅延時間（ミリ秒）
   */
  constructor(header, options = {}) {
    this.header = header
    this.options = {
      threshold: options.threshold || 100,
      scrolledClass: options.scrolledClass || 'is-scrolled',
      hideOnScroll: options.hideOnScroll || false,
      hideThreshold: options.hideThreshold || 200,
      hiddenClass: options.hiddenClass || 'is-hidden',
      hideDelay: options.hideDelay || 300
    }

    this.lastScrollY = 0
    this.ticking = false
    this.hideTimeout = null

    // バインドしたハンドラーを保持
    this.boundHandleScroll = this.handleScroll.bind(this)
  }

  /**
   * 初期化
   */
  init() {
    window.addEventListener('scroll', this.boundHandleScroll, { passive: true })
    // 初期状態をチェック
    this.update(window.scrollY)
  }

  /**
   * スクロールハンドラー
   */
  handleScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.update(window.scrollY)
        this.ticking = false
      })
      this.ticking = true
    }
  }

  /**
   * スクロール位置に応じてクラスを更新
   * @param {number} scrollY - 現在のスクロール位置
   */
  update(scrollY) {
    // スクロール位置によるクラス追加/削除
    if (scrollY > this.options.threshold) {
      this.header.classList.add(this.options.scrolledClass)
    } else {
      this.header.classList.remove(this.options.scrolledClass)
    }

    // hide-on-scroll機能
    if (this.options.hideOnScroll) {
      // 一定以上スクロールしている場合のみhide判定
      if (scrollY > this.options.hideThreshold) {
        // スクロール中は隠す
        this.header.classList.add(this.options.hiddenClass)

        // 既存のタイマーをクリア
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout)
        }

        // スクロール停止後に表示
        this.hideTimeout = setTimeout(() => {
          this.header.classList.remove(this.options.hiddenClass)
        }, this.options.hideDelay)
      } else {
        // トップ付近では常に表示
        this.header.classList.remove(this.options.hiddenClass)
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout)
        }
      }
    }

    this.lastScrollY = scrollY
  }

  /**
   * 破棄
   */
  destroy() {
    window.removeEventListener('scroll', this.boundHandleScroll)
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }
    this.header.classList.remove(this.options.scrolledClass)
    this.header.classList.remove(this.options.hiddenClass)
  }
}
