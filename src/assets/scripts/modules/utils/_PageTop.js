/**
 * ページトップボタン
 * スクロール位置に応じて表示/非表示を切り替え、クリックでトップに戻る
 */
export default class PageTop {
  /**
   * @param {HTMLElement} element - ページトップボタン要素
   * @param {Object} options - オプション
   * @param {number} options.showThreshold - ボタンを表示するスクロール位置の閾値
   * @param {string} options.showClass - 表示時に追加するクラス名
   * @param {Object} options.lenis - Lenisインスタンス（スムーススクロール用、省略可）
   */
  constructor(element, options = {}) {
    this.element = element
    this.options = {
      showThreshold: options.showThreshold || 200,
      showClass: options.showClass || 'is-show',
      lenis: options.lenis || null
    }

    this.ticking = false
    this.boundHandleScroll = this.handleScroll.bind(this)
    this.boundScrollToTop = this.scrollToTop.bind(this)
  }

  /**
   * 初期化
   */
  init() {
    if (!this.element) return

    // イベント登録
    window.addEventListener('scroll', this.boundHandleScroll, { passive: true })
    this.element.addEventListener('click', this.boundScrollToTop)

    // 初期状態をチェック
    this.handleScroll()
  }

  /**
   * スクロールハンドラー
   */
  handleScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop

        if (scrollY > this.options.showThreshold) {
          this.element.classList.add(this.options.showClass)
        } else {
          this.element.classList.remove(this.options.showClass)
        }

        this.ticking = false
      })
      this.ticking = true
    }
  }

  /**
   * トップにスクロール
   * @param {Event} e - クリックイベント
   */
  scrollToTop(e) {
    e.preventDefault()

    // Lenisが使用可能ならLenisでスクロール
    if (this.options.lenis) {
      this.options.lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    } else {
      // フォールバック: ネイティブスムーススクロール
      const scrollRoot = 'scrollingElement' in document 
        ? document.scrollingElement 
        : document.documentElement
      
      scrollRoot.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  /**
   * 破棄
   */
  destroy() {
    window.removeEventListener('scroll', this.boundHandleScroll)
    this.element.removeEventListener('click', this.boundScrollToTop)
    this.element.classList.remove(this.options.showClass)
  }
}
