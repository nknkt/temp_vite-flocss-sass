export default class SectionAnimation {
  constructor() {
    this.sections = document.querySelectorAll('.js-section')
  }

  init() {
    if (this.sections.length === 0) return

    // 画面サイズ確定後に計算 (Lenisの初期化中などにブレないよう)
    requestAnimationFrame(() => {
      const vh = window.innerHeight

      this.sections.forEach(section => {
        const h = Math.round(section.offsetHeight)
        if (h > vh) {
          section.style.top = `${vh - h}px`
        }
      })
    })
  }
}
