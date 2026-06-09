// styles
import '../../common.js'
import '../../../styles/object/pages/index/_index.scss'

// vendors
import Lenis from 'lenis'

// utils
import ScrollActive from '../../modules/utils/_ScrollActive.js'
import AnchorScroll from '../../modules/utils/_AnchorScroll.js'
import HamburgerMenu from '../../modules/utils/_HamburgerMenu.js'
import HeaderScroll from '../../modules/utils/_HeaderScroll.js'

// optional

// ============================================================
// Lenis初期化（スムーススクロール）
// ============================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ============================================================
// DOMContentLoaded後に初期化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Header Scroll
  const header = document.querySelector('.l-header')
  if (header) {
    const headerScroll = new HeaderScroll(header, {
      threshold: 100,
      scrolledClass: 'is-scrolled',
      hideOnScroll: true,
      hideThreshold: 200,
      hiddenClass: 'is-hidden',
    })
    headerScroll.init()
  }

  // Hamburger Menu
  let hamburgerMenu
  const hamburger = document.querySelector('.js-hamburger')
  const navMenu = document.querySelector('.js-nav-menu')
  if (hamburger && navMenu) {
    hamburgerMenu = new HamburgerMenu(hamburger, navMenu)
    hamburgerMenu.init()
  }

  // Anchor scroll
  const anchorScroll = new AnchorScroll('a[href^="#"]', hamburgerMenu, lenis)
  anchorScroll.init()

  // Scroll Active
  const fadeInEls = document.getElementsByClassName('u-fade-in')
  Array.from(fadeInEls).forEach(el => {
    const scrollActive = new ScrollActive(el)
    scrollActive.init()
  })
})