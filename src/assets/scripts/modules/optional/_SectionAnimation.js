import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default class SectionAnimation {
  constructor() {
    this.sections = document.querySelectorAll('.js-section')
  }

  init() {
    if (this.sections.length === 0) return

    this.setupSectionAnimations()
  }

  setupSectionAnimations() {
    this.sections.forEach((section, index) => {
      // sticky で前のセクションの上に被さるように表示
      gsap.set(section, {
        position: 'sticky',
        top: 0,
        zIndex: 100 + index
      })
    })
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
}
