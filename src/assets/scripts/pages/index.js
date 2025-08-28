import AnchorScroll from '../modules/_AnchorScroll.js'
import ScrollActive from '../modules/_ScrollActive.js'
import Collapse from '../modules/_Collapse.js'
import HamburgerMenu from '../modules/_HamburgerMenu.js'
import HeaderScroll from '../modules/_HeaderScroll.js'
import IntroTextAnimate from '../modules/_IntroTextAnimate.js'
import HorizontalScroll from '../modules/_HorizontalScroll.js'
import PageTop from '../modules/_PageTop.js'
import creatorTable from '../components/creator-table.js'
window.creatorTable = creatorTable // import直後に記載

// DOMContentLoaded後に初期化
document.addEventListener('DOMContentLoaded', () => {
  // HorizontalScroll初期化（必要なら）
  if (typeof HorizontalScroll === 'function') {
    HorizontalScroll()
  }

  // creatorTable初期化（必要なら）
  if (typeof creatorTable === 'function') {
    creatorTable()
  }

  // Hamburger Menu
  {
    const hamburger = document.getElementsByClassName('js-hamburger')[0]
    const navMenu = document.getElementsByClassName('js-nav-menu')[0]
    const navBg = document.getElementsByClassName('l-navigation__bg')[0]

    if (hamburger && navMenu && navBg) {
      const hamburgerMenu = new HamburgerMenu(hamburger, navMenu, {}, navBg)
      hamburgerMenu.init()
    }
  }

  // Anchor scroll
  {
    const anchorScroll = new AnchorScroll()
    anchorScroll.init()
  }

  // Scroll Active
  {
    const els = document.getElementsByClassName('js-scroll-active')
    Array.from(els).forEach(el => {
      const scrollActive = new ScrollActive(el)
      scrollActive.init()
    })
  }

  // HeaderScroll（l-headerのロゴ制御）
  {
    const header = document.querySelector('.l-header')
    if (header) {
      const headerScroll = new HeaderScroll(header)
      headerScroll.init()
    }
  }

  // Intro Text Animate
  {
    const introTextAnimate = new IntroTextAnimate('.js-animate-text')
    introTextAnimate.animate()
  }

  // Page Top Button
  {
    const pageTopButton = document.querySelector('.js-page-top')
    if (pageTopButton) {
      const pageTop = new PageTop(pageTopButton)
      pageTop.init()
    }
  }
})

// Collapse（ページロード後に初期化）
window.addEventListener('load', () => {
  document.querySelectorAll('[data-collapse-toggler]').forEach(el => {
    const collapse = new Collapse(el, {
      hashNavigation: true,
    })
    collapse.init()
  })
})

// リサイズ時の横スクロール再初期化
let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (typeof window.horizontalScroll !== 'undefined') {
      window.horizontalScroll.recreateAll()
    }
  }, 300)
})
