/**
 * ScrollTextReveal - スクロール連動テキストアニメーション
 * テキストを1文字ずつ順番にフェードインさせる
 * デザイナーに人気のエフェクト
 * 
 * @example
 * const textReveal = new ScrollTextReveal('.js-text-reveal')
 * textReveal.animate()
 * 
 * @example カスタム設定
 * const textReveal = new ScrollTextReveal('.js-text-reveal', {
 *   startOpacity: 0,
 *   endOpacity: 1,
 *   startPoint: 0.9,
 *   endPoint: 0.5,
 *   progressExtend: 1.3,
 *   charDuration: 0.3
 * })
 * textReveal.animate()
 */
export default class ScrollTextReveal {
  constructor(selector = '.js-text-reveal', options = {}) {
    this.selector = selector

    // オプション設定
    this.options = {
      startOpacity: 0.2,      // 初期透明度
      endOpacity: 1,          // 最終透明度
      startPoint: 0.9,        // アニメーション開始位置（画面の何%）
      endPoint: 0.5,          // アニメーション終了位置（画面の何%）
      progressExtend: 1.3,    // 進行度の拡張率（最後の文字まで確実に1になるように）
      charDuration: 0.3,      // 各文字のアニメーション期間（0-1の範囲）
      charClass: 'js-char',   // 文字に付与するクラス名
      preserveSpaces: true,   // スペースや改行を保持するか
      ...options
    }
  }

  wrapTextToSpan(element) {
    const walk = node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        node.textContent.split('').forEach(char => {
          if (this.options.preserveSpaces && (char === ' ' || char === '\n')) {
            frag.appendChild(document.createTextNode(char))
          } else {
            const span = document.createElement('span')
            span.className = this.options.charClass
            span.style.opacity = String(this.options.startOpacity)
            span.textContent = char
            frag.appendChild(span)
          }
        })
        node.parentNode.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk)
      }
    }
    walk(element)
  }

  animate() {
    const targets = document.querySelectorAll(this.selector)
    targets.forEach(target => {
      this.wrapTextToSpan(target)
      const chars = target.querySelectorAll(`.${this.options.charClass}`)
      const total = chars.length

      const onScroll = () => {
        const rect = target.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const startPoint = windowHeight * this.options.startPoint
        const endPoint = windowHeight * this.options.endPoint

        // 要素の上端が startPoint を通過してから endPoint まででアニメーション
        let progress = (startPoint - rect.top) / (startPoint - endPoint)
        progress = Math.min(Math.max(progress, 0), 1)

        // 各文字に対して徐々に透明度を変化させる
        chars.forEach((char, i) => {
          // 全体の進行度を拡張
          const extendedProgress = progress * this.options.progressExtend
          // 各文字の開始位置（0から1の範囲）
          const charStartProgress = i / total
          // 各文字の進行度
          const charProgress = (extendedProgress - charStartProgress) / this.options.charDuration
          const clampedCharProgress = Math.min(Math.max(charProgress, 0), 1)

          // 透明度を計算
          const opacity = this.options.startOpacity + 
            (this.options.endOpacity - this.options.startOpacity) * clampedCharProgress
          char.style.opacity = String(opacity)
        })
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll() // 初期表示
    })
  }
}
