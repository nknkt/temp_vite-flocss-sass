// vendors
import Lenis from 'lenis'

// utils（ほぼ毎回使う基本機能）
import ScrollActive from '../modules/utils/_ScrollActive.js'
import AnchorScroll from '../modules/utils/_AnchorScroll.js'
import Accordion from '../modules/utils/_Accordion.js'
import HamburgerMenu from '../modules/utils/_HamburgerMenu.js'
import HeaderScroll from '../modules/utils/_HeaderScroll.js'
import LoadingAnimation from '../modules/utils/_LoadingAnimation.js'
import PageTop from '../modules/utils/_PageTop.js'

// optional（汎用的だが毎回は使わない機能）
import ParallaxScroll from '../modules/optional/_ParallaxScroll.js'
import ScrollImageSwitcher from '../modules/optional/_ScrollImageSwitcher.js'
import GSAPHorizontalScroll from '../modules/optional/_GSAPHorizontalScroll.js'
import HueRotate from '../modules/optional/_HueRotate.js'
import ScrollTextReveal from '../modules/optional/_ScrollTextReveal.js'
import BasicSlider from '../modules/optional/_BasicSlider.js'
// import HorizontalScroll from '../modules/optional/_HorizontalScroll.js'
// import ScrollImageExpand from '../modules/optional/_ScrollImageExpand.js'
// import ScrollBackgroundScale from '../modules/optional/_ScrollBackgroundScale.js'
import Modal from '../modules/optional/_Modal.js'

// デバッグモード判定
const urlParams = new URLSearchParams(window.location.search)
const isDebugMode = urlParams.get('debug') === 'true'

// Loading Animation初期化（デバッグモードではスキップ）
if (!isDebugMode) {
  new LoadingAnimation({
    loadingSelector: '.p-loading, .p-loading-bg',
    bodyLoadingClass: 'is-loading',
    bodyReadyClass: 'is-loading--header-ready',
    fadeOutClass: 'is-fade-out',
    minDisplayTime: 1000,
    fadeOutDuration: 1200,
    completeEventName: 'loadingComplete',
    resetScrollPosition: true,  // スクロール位置をトップに戻す
    showOnce: true,             // 毎回表示（trueにすると1回のみ）
    storageKey: 'loadingShown'
  })
} else {
  // デバッグモード: ローディングをスキップ
  if (history.scrollRestoration) {
    history.scrollRestoration = 'auto'
  }
  const loadingElements = document.querySelectorAll('.p-loading, .p-loading-bg')
  loadingElements.forEach(el => el.remove())
  document.body.classList.remove('is-loading')
}

// Lenis初期化
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// DOMContentLoaded後に初期化
document.addEventListener('DOMContentLoaded', () => {
  // Header Scroll
  {
    const header = document.querySelector('.l-header')
    if (header) {
      const headerScroll = new HeaderScroll(header, {
        threshold: 100,
        scrolledClass: 'is-scrolled',
        hideOnScroll: true,
        hideThreshold: 200,
        hiddenClass: 'is-hidden'
      })
      headerScroll.init()
    }
  }

  // Hamburger Menu
  let hamburgerMenu
  {
    const hamburger = document.querySelector('.js-hamburger')
    const navMenu = document.querySelector('.js-nav-menu')
    const navBg = document.querySelector('.l-navigation__bg')

    if (hamburger && navMenu) {
      hamburgerMenu = new HamburgerMenu(hamburger, navMenu, {}, navBg)
      hamburgerMenu.init()
    }
  }

  // Anchor scroll
  {
    const anchorScroll = new AnchorScroll('a[href^="#"]', hamburgerMenu, lenis)
    anchorScroll.init()
  }

  // Scroll Active
  {
    const els = document.getElementsByClassName('u-fade-in');
    Array.from(els).forEach(el => {
      const scrollActive = new ScrollActive(el);
      scrollActive.init();
    });
  }

  // Page Top Button（デバッグモードではスキップ）
  if (!isDebugMode) {
    const pageTopButton = document.querySelector('.js-page-top')
    if (pageTopButton) {
      const pageTop = new PageTop(pageTopButton, {
        showThreshold: 200,
        showClass: 'is-show',
        lenis: lenis
      })
      pageTop.init()
    }
  }

  // Parallax Scroll
  {
    new ParallaxScroll(lenis)
  }

  // Hue Rotate
  {
    new HueRotate(lenis)
  }

  // Voice Slider
  {
    const voiceSlider = document.querySelector('.js-voice-slider')
    if (voiceSlider) {
      new BasicSlider(voiceSlider, {
        type: 'loop',
        fixedWidth: '45rem',
        gap: '5rem',
        breakpoints: {
          768: {
            fixedWidth: '29rem',
            gap: '2rem',
            focus: 'center'
          }
        }
      })
    }
  }

  // Flow Slider
  {
    const flowSlider = document.querySelector('.js-flow-slider')
    if (flowSlider) {
      new GSAPHorizontalScroll(flowSlider, {
        trackSelector: '.p-flow__list',
        progressBarSelector: '.p-flow__progress-fill',
        lenis
      })
    }
  }

  // FAQ
  {
    new Accordion() // デフォルトセレクタを使用
  }

  // Text Reveal Animation
  {
    const textReveal = new ScrollTextReveal('.js-animate-text')
    textReveal.animate()
  }

  // Feature Block
  {
    const featureBlock = document.querySelector('.p-feature-block')
    if (featureBlock) {
      new ScrollImageSwitcher(featureBlock, {
        textSelector: '.p-feature-block__texts',
        imageSelector: '.p-feature-block__image'
      })
    }
  }

  // Self Check Modal
  {
    // PC時: モーダル表示、SP時: 別ページに遷移
    const ctaButton = document.querySelector('.js-cta-button')
    const modal = document.querySelector('.js-self-check-modal')
    const isMobile = window.matchMedia('(max-width: 767px)').matches

    if (ctaButton && modal) {
      if (isMobile) {
        // SP時は別ページに遷移
        ctaButton.addEventListener('click', (e) => {
          e.preventDefault()
          window.open('./selfcheck/', '_blank', 'noopener,noreferrer')
        })
      } else {
        // PC時はモーダルを開く
        new Modal({
          trigger: ctaButton,
          modal,
          close: '.js-modal-close',
          lenis
        })
      }
    }
  }
});