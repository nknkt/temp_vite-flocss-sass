/**
 * パララックススクロール効果
 */
export default class ParallaxScroll {
  constructor(lenis = null) {
    this.lenis = lenis
    this.parallaxElements = document.querySelectorAll('.js-parallax')
    this.init()
  }

  init() {
    if (this.parallaxElements.length === 0) return

    this.handleScroll()

    if (this.lenis) {
      this.lenis.on('scroll', () => this.handleScroll())
    } else {
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true })
    }
  }

  handleScroll() {
    this.parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5

      // 要素が画面内またはその周辺にある場合のみ計算
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // ビューポート上部からの相対位置を計算
        const yPos = -rect.top * speed
        element.style.setProperty('--parallax-y', `${yPos}px`)
      }
    })
  }
}
