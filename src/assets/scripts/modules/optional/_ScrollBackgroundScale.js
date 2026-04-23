/**
 * ScrollBackgroundScale - スクロール連動背景スケール
 * スクロールに応じて背景画像のスケールを変化させる
 *
 * @example
 * // 自動初期化（data属性で制御）
 * const scaleElements = document.querySelectorAll('.js-bg-scale')
 * scaleElements.forEach(el => new ScrollBackgroundScale(el, { lenis: lenisInstance }))
 *
 * @example カスタム設定
 * const scale = new ScrollBackgroundScale(
 *   document.querySelector('.js-bg-scale'),
 *   {
 *     minScale: 1,
 *     maxScale: 1.2,
 *     cssVariable: '--scale',
 *     lenis: lenisInstance
 *   }
 * )
 *
 * @example HTML
 * <div class="js-bg-scale" data-scale-min="1" data-scale-max="1.3">
 *   <div style="background-image: url(...); transform: scale(var(--scale))"></div>
 * </div>
 */
export default class ScrollBackgroundScale {
  constructor(element, options = {}) {
    this.element = element
    if (!this.element) return

    // data属性から値を取得
    const dataMinScale = parseFloat(this.element.dataset.scaleMin)
    const dataMaxScale = parseFloat(this.element.dataset.scaleMax)

    // オプション設定
    this.options = {
      lenis: null,                                    // Lenisインスタンス
      minScale: !isNaN(dataMinScale) ? dataMinScale : 1,    // 最小スケール
      maxScale: !isNaN(dataMaxScale) ? dataMaxScale : 1.2,  // 最大スケール
      cssVariable: '--scale',                         // CSS変数名
      ...options
    }

    this.init()
  }

  init() {
    // 初期値を設定
    this.element.style.setProperty(this.options.cssVariable, this.options.minScale)

    if (this.options.lenis) {
      // Lenis使用時
      this.options.lenis.on('scroll', ({ scroll }) => {
        this.handleScroll(scroll)
      })
    } else {
      // 通常のスクロールイベント
      window.addEventListener('scroll', () => {
        this.handleScroll(window.scrollY)
      })
    }

    // 初期スクロール位置で実行
    const initialScroll = this.options.lenis
      ? this.options.lenis.scroll
      : window.scrollY
    this.handleScroll(initialScroll)
  }

  handleScroll(scrollY) {
    // 要素の位置を取得
    const rect = this.element.getBoundingClientRect()
    const elementTop = rect.top + scrollY
    const elementHeight = rect.height
    const windowHeight = window.innerHeight

    // 要素が画面内に入った時の進行度を計算
    const scrollRange = elementHeight + windowHeight
    const scrollProgress = Math.max(0, Math.min(1,
      (scrollY + windowHeight - elementTop) / scrollRange
    ))

    // スケール値を計算
    const scale = this.options.minScale +
      (this.options.maxScale - this.options.minScale) * scrollProgress

    // CSS変数を更新
    this.element.style.setProperty(this.options.cssVariable, scale)
  }

  // スケール範囲を動的に更新
  updateScaleRange(minScale, maxScale) {
    this.options.minScale = minScale
    this.options.maxScale = maxScale
  }
}
