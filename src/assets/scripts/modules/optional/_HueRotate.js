/**
 * HueRotate - スクロール連動色相変化
 * スクロール進行度に応じて複数の色を補間しながら変化させる
 * 色の補間計算の参考実装として使える
 *
 * @example
 * const hueRotate = new HueRotate(lenisInstance)
 *
 * @example カスタム設定
 * const hueRotate = new HueRotate(lenisInstance, {
 *   elementSelector: '.js-color-change',
 *   targetSelector: '.target-element',
 *   colors: [
 *     [255, 0, 0],     // 赤
 *     [0, 255, 0],     // 緑
 *     [0, 0, 255]      // 青
 *   ],
 *   opacity: 0.8,
 *   cssVariable: '--dynamic-color',
 *   startOffset: 0.8,
 *   endOffset: 0.2
 * })
 */
export default class HueRotate {
  constructor(lenis = null, options = {}) {
    this.lenis = lenis

    // オプション設定
    this.options = {
      elementSelector: '.js-hue-rotate',     // 監視する要素
      targetSelector: null,                  // 色を適用する子要素（nullの場合は自身）
      colors: [                              // 補間する色の配列 [R, G, B]
        [255, 200, 150],                     // オレンジ
        [150, 220, 180],                     // グリーン
        [200, 180, 240]                      // パープル
      ],
      opacity: 0.5,                          // 色の不透明度
      cssVariable: '--color',                // CSS変数名
      startOffset: 0.8,                      // アニメーション開始位置（0-1）
      endOffset: 0.2,                        // アニメーション終了位置（0-1）
      ...options
    }

    this.elements = document.querySelectorAll(this.options.elementSelector)
    this.init()
  }

  init() {
    if (this.elements.length === 0) return

    this.handleScroll()

    if (this.lenis) {
      this.lenis.on('scroll', () => this.handleScroll())
    } else {
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true })
    }
  }

  handleScroll() {
    const colors = this.options.colors

    this.elements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // アニメーション範囲の計算
      const startPos = windowHeight - elementHeight * this.options.startOffset
      const endPos = -elementHeight * this.options.endOffset

      const totalDistance = startPos - endPos
      const currentPos = rect.top
      const progress = Math.max(0, Math.min((startPos - currentPos) / totalDistance, 1))

      // 要素が表示範囲内にある場合のみ処理
      if (rect.bottom > 0 && rect.top < windowHeight) {
        // 色の変化を計算（複数色間の補間）
        const segmentLength = 1 / (colors.length - 1)
        const segmentIndex = Math.min(Math.floor(progress / segmentLength), colors.length - 2)
        const segmentProgress = (progress - segmentIndex * segmentLength) / segmentLength

        const currentColor = colors[segmentIndex]
        const nextColor = colors[segmentIndex + 1]

        // RGB値を補間
        const r = Math.round(currentColor[0] + (nextColor[0] - currentColor[0]) * segmentProgress)
        const g = Math.round(currentColor[1] + (nextColor[1] - currentColor[1]) * segmentProgress)
        const b = Math.round(currentColor[2] + (nextColor[2] - currentColor[2]) * segmentProgress)

        // 対象要素を取得
        const target = this.options.targetSelector
          ? element.querySelector(this.options.targetSelector)
          : element

        // CSS変数として色を設定
        if (target) {
          target.style.setProperty(
            this.options.cssVariable,
            `rgba(${r}, ${g}, ${b}, ${this.options.opacity})`
          )
        }
      }
    })
  }
}
