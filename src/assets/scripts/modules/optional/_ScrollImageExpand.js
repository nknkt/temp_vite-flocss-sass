/**
 * ScrollImageExpand - スクロール連動画像拡大
 * スクロールに応じて画像が拡大し、背景のように画面全体に広がる効果
 *
 * @example
 * const expand = new ScrollImageExpand(document.querySelector('.js-expand-image'), {
 *   lenis: lenisInstance
 * })
 *
 * @example カスタム設定
 * const expand = new ScrollImageExpand(
 *   document.querySelector('.js-expand-image'),
 *   {
 *     startOffset: 0,
 *     endOffset: 1000,
 *     minScale: 1,
 *     maxScale: 2,
 *     fixedClass: 'is-fixed',
 *     expandedClass: 'is-expanded'
 *   }
 * )
 */
export default class ScrollImageExpand {
  constructor(element, options = {}) {
    this.element = element
    if (!this.element) return

    // オプション設定
    this.options = {
      lenis: null,                          // Lenisインスタンス
      startOffset: 0,                       // 拡大開始位置（px）
      endOffset: window.innerHeight,        // 拡大終了位置（px）
      minScale: 1,                          // 最小拡大率
      maxScale: 1.5,                        // 最大拡大率
      fixedClass: 'is-fixed',              // 固定表示時のクラス
      expandedClass: 'is-expanded',        // 拡大完了時のクラス
      imageSelector: 'img',                 // 画像要素のセレクタ
      ...options
    }

    this.image = this.element.querySelector(this.options.imageSelector)
    if (!this.image) return

    // 初期位置を計算
    this.initialTop = this.element.offsetTop
    this.elementHeight = this.element.offsetHeight

    this.init()
  }

  init() {
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
    const elementTop = this.initialTop
    const triggerStart = elementTop + this.options.startOffset
    const triggerEnd = elementTop + this.options.endOffset

    // トリガー範囲外なら何もしない
    if (scrollY < triggerStart) {
      this.reset()
      return
    }

    // トリガー範囲内での進行度を計算（0〜1）
    const progress = Math.min(
      (scrollY - triggerStart) / (triggerEnd - triggerStart),
      1
    )

    // 拡大率を計算
    const scale = this.options.minScale +
      (this.options.maxScale - this.options.minScale) * progress

    // transformを適用
    this.image.style.transform = `scale(${scale})`

    // 固定表示の制御
    if (progress > 0 && progress < 1) {
      this.element.classList.add(this.options.fixedClass)
      this.element.classList.remove(this.options.expandedClass)
    } else if (progress >= 1) {
      this.element.classList.add(this.options.expandedClass)
      this.element.classList.remove(this.options.fixedClass)
    }
  }

  reset() {
    this.image.style.transform = `scale(${this.options.minScale})`
    this.element.classList.remove(this.options.fixedClass)
    this.element.classList.remove(this.options.expandedClass)
  }

  // オフセットを動的に更新
  updateOffsets(startOffset, endOffset) {
    this.options.startOffset = startOffset
    this.options.endOffset = endOffset
  }

  // 要素位置を再計算（ウィンドウリサイズ時など）
  recalculate() {
    this.initialTop = this.element.offsetTop
    this.elementHeight = this.element.offsetHeight
  }
}
