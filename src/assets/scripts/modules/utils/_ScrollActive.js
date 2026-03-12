/**
 * スクロール連動アクティブクラス追加
 * IntersectionObserverを使用した要素の可視状態検知
 */
export default class ScrollActive {
  /**
   * @param {HTMLElement} element - 監視する要素
   * @param {Object} options - オプション
   * @param {string} options.activeClass - 追加するクラス名
   * @param {number} options.threshold - 交差判定の閾値（0.0〜1.0）
   * @param {boolean} options.once - 一度だけ実行するか
   * @param {Function} options.callback - 交差時のコールバック関数
   */
  constructor(element, options = {}) {
    this.element = element
    this.options = {
      activeClass: options.activeClass || 'is-active',
      threshold: options.threshold !== undefined ? options.threshold : 0.5,
      once: options.once !== undefined ? options.once : true,
      callback: options.callback || null
    }

    // data属性から閾値を取得（優先）
    if (this.element.dataset.threshold) {
      this.options.threshold = Number(this.element.dataset.threshold)
    }

    this.observer = null
  }

  /**
   * 初期化
   */
  init() {
    if (!this.element) return

    this.observer = new IntersectionObserver(
      this.handleIntersect.bind(this),
      {
        threshold: this.options.threshold
      }
    )

    this.observer.observe(this.element)
  }

  /**
   * 交差判定ハンドラー
   * @param {IntersectionObserverEntry[]} entries - 監視エントリー
   */
  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 交差時: クラスを追加
        entry.target.classList.add(this.options.activeClass)

        // コールバック実行
        if (this.options.callback) {
          this.options.callback()
        }

        // 一度だけ実行の場合は監視を解除
        if (this.options.once) {
          this.observer.unobserve(entry.target)
        }
      } else {
        // 交差解除時: onceがfalseの場合はクラスを削除
        if (!this.options.once) {
          entry.target.classList.remove(this.options.activeClass)
        }
      }
    })
  }

  /**
   * 破棄
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.element.classList.remove(this.options.activeClass)
  }
}
