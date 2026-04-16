export default class SectionAnimation {
  constructor() {
    this.sections = document.querySelectorAll('.js-section')
  }

  init() {
    if (this.sections.length === 0) return

    const vh = window.innerHeight

    this.sections.forEach(section => {
      const h = section.offsetHeight
      if (h > vh) {
        section.style.top = `${vh - h}px`
      }
    })
  }
}
