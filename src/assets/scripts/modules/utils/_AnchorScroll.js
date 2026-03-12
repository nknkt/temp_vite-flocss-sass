/**
 * アンカースクロール
 * Lenisを使用したスムーズスクロール
 */
export default class AnchorScroll {
  constructor(selector = 'a[href^="#"]', hamburgerMenu = null, lenis = null) {
    this.links = document.querySelectorAll(selector)
    this.hamburgerMenu = hamburgerMenu
    this.lenis = lenis
  }

  getScrollPaddingTop() {
    const style = getComputedStyle(document.documentElement)
    const padding = style.scrollPaddingTop
    return padding ? parseFloat(padding) : 0
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener(
        'click',
        e => {
          e.preventDefault()
          e.stopImmediatePropagation()
          const href = link.getAttribute('href')

          // ハンバーガーメニューを閉じる
          if (this.hamburgerMenu && this.hamburgerMenu.isOpen) {
            this.hamburgerMenu.close()
          }

          // ページトップへ
          if (href === '#') {
            if (this.lenis) {
              this.lenis.scrollTo(0, { duration: 1.2 })
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            return
          }

          // ターゲット要素にスクロール
          const target = document.querySelector(href)
          if (target) {
            const offset = this.getScrollPaddingTop()
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset
            if (this.lenis) {
              // lenis に要素を渡すと内部計算の差で期待位置とズレることがあるため
              // 明示的な数値位置を渡す
              this.lenis.scrollTo(targetTop, { offset: 0, duration: 1.2 })
            } else {
              window.scrollTo({ top: targetTop, behavior: 'smooth' })
            }
          }
        },
        { capture: true },
      )
    })

    // ページ読み込み時のハッシュ対応
    if (location.hash) {
      // ハッシュからターゲットへスクロール

      const handleHash = () => {
        const fragment = location.hash
        const matches = Array.from(document.querySelectorAll(fragment))
        if (!matches.length) return
        const target = matches[0]

        const offset = this.getScrollPaddingTop()

        // 要素のドキュメント上の絶対位置を計算
        const getDocumentOffset = el => {
          let off = 0
          let node = el
          while (node) {
            off += node.offsetTop || 0
            node = node.offsetParent
          }
          return off
        }

        const docTop = getDocumentOffset(target)
        const targetTop = docTop - offset

        if (this.lenis) {
          this.lenis.scrollTo(targetTop, { offset: 0, duration: 1.2 })
        } else {
          window.scrollTo({ top: targetTop, behavior: 'smooth' })
        }

        // レイアウトが後から変わるケースに備え、複数回チェックして位置を補正する
        const maxTries = 6
        let tries = 0
        const interval = 150

        const attemptFix = () => {
          tries += 1
          const rectTop = target.getBoundingClientRect().top
          const desiredViewportTop = offset
          const diff = Math.abs(rectTop - desiredViewportTop)

          if (diff > 2) {
            // ずれていれば即時で位置を合わせる（lenis かネイティブ）
            if (this.lenis) {
              this.lenis.scrollTo(targetTop, { offset: 0, duration: 0 })
            } else {
              window.scrollTo({ top: targetTop })
            }
          }

          if (tries < maxTries && diff > 2) {
            setTimeout(attemptFix, interval)
          }
        }

        setTimeout(attemptFix, interval)
      }

      if (document.readyState === 'complete') {
        handleHash()
      } else {
        window.addEventListener('load', handleHash, { once: true })
      }
    }
  }
}
