import Splide from '@splidejs/splide'

/**
 * BasicSlider - Splideを使った基本的なスライダー
 * 複数のスライダーを扱うことを前提とした設計
 * よく使うオプションの参考実装
 *
 * @example 単一スライダー
 * const slider = new BasicSlider('.js-slider')
 *
 * @example 複数スライダーを一括初期化
 * const sliders = BasicSlider.initAll('.js-slider')
 *
 * @example カスタムオプション
 * const slider = new BasicSlider('.js-slider', {
 *   type: 'loop',
 *   perPage: 3,
 *   gap: '2rem',
 *   pagination: true,
 *   arrows: true
 * })
 *
 * @example レスポンシブ設定
 * const slider = new BasicSlider('.js-slider', {
 *   perPage: 3,
 *   gap: '2rem',
 *   breakpoints: {
 *     1024: { perPage: 2 },
 *     768: { perPage: 1 }
 *   }
 * })
 *
 * よく使うオプション一覧：
 * - type: 'slide' | 'loop' | 'fade' - スライダーのタイプ
 * - perPage: number - 1画面に表示する枚数
 * - perMove: number - 1回に移動する枚数
 * - gap: string - スライド間のギャップ
 * - padding: string | { left: number, right: number } - 左右のパディング
 * - fixedWidth: string - 固定幅
 * - fixedHeight: string - 固定高さ
 * - focus: 'center' | number - フォーカス位置
 * - autoplay: boolean - 自動再生
 * - interval: number - 自動再生の間隔（ms）
 * - speed: number - アニメーション速度（ms）
 * - arrows: boolean - 矢印の表示
 * - pagination: boolean - ページネーションの表示
 * - keyboard: boolean - キーボード操作
 * - drag: boolean - ドラッグ操作
 * - wheel: boolean - ホイール操作
 * - pauseOnHover: boolean - ホバー時に一時停止
 * - pauseOnFocus: boolean - フォーカス時に一時停止
 * - breakpoints: object - レスポンシブ設定
 */
export default class BasicSlider {
  constructor(selector, options = {}) {
    this.slider = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector

    if (!this.slider) return

    this.options = options
    this.splide = null
    this.init()
  }

  init() {
    // デフォルトオプション
    const defaultOptions = {
      type: 'loop',
      gap: '2rem',
      pagination: false,
      arrows: true,
      keyboard: true,
      pauseOnHover: true,
      pauseOnFocus: true,
      ...this.options
    }

    this.splide = new Splide(this.slider, defaultOptions)
    this.splide.mount()
  }

  // 複数のスライダーを一括初期化
  static initAll(selector, options = {}) {
    const elements = document.querySelectorAll(selector)
    const instances = []

    elements.forEach(element => {
      const instance = new BasicSlider(element, options)
      if (instance.splide) {
        instances.push(instance)
      }
    })

    return instances
  }

  // スライダーのインスタンスを取得（カスタマイズ用）
  getInstance() {
    return this.splide
  }

  // スライダーを破棄
  destroy() {
    if (this.splide) {
      this.splide.destroy()
    }
  }

  // 次のスライドへ
  next() {
    if (this.splide) {
      this.splide.go('>')
    }
  }

  // 前のスライドへ
  prev() {
    if (this.splide) {
      this.splide.go('<')
    }
  }

  // 指定のスライドへ
  go(index) {
    if (this.splide) {
      this.splide.go(index)
    }
  }

  // リフレッシュ
  refresh() {
    if (this.splide) {
      this.splide.refresh()
    }
  }
}
