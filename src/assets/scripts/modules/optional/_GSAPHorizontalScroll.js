import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAPHorizontalScroll - 縦スクロールを横スクロールに変換
 * GSAP ScrollTriggerを使用した横スクロール実装
 * 慣性スクロール（Lenis等）にも対応
 *
 * @example
 * const slider = new GSAPHorizontalScroll(
 *   document.querySelector('.js-horizontal-slider'),
 *   { lenis: lenisInstance }
 * )
 *
 * @example カスタム設定
 * const slider = new GSAPHorizontalScroll(
 *   document.querySelector('.js-slider'),
 *   {
 *     trackSelector: '.js-slider-track',
 *     progressBarSelector: '.js-progress-fill',
 *     topOffset: 100,
 *     breakpoint: 768,
 *     scrub: 1
 *   }
 * )
 */
export default class GSAPHorizontalScroll {
  constructor(container, options = {}) {
    this.container = container
    if (!this.container) return

    // オプション設定
    this.options = {
      trackSelector: '.js-horizontal-track',     // スクロールするトラック要素
      progressBarSelector: null,                 // プログレスバー（nullで無効）
      wrapperElement: null,                      // ピン固定する要素（nullの場合は親要素）
      topOffset: 170,                            // 固定開始位置（px）
      topOffsetMax: 300,                         // 高解像度時の最大オフセット
      topOffsetViewportThreshold: 1080,          // オフセット増加開始の画面高さ
      breakpoint: 768,                           // SP無効化ブレークポイント
      scrub: 1,                                  // スクロール追従速度
      lenis: null,                               // Lenisインスタンス
      ...options
    }

    this.track = this.container.querySelector(this.options.trackSelector)
    if (!this.track) return

    this.lenis = this.options.lenis
    this.mql = window.matchMedia(`(max-width: ${this.options.breakpoint}px)`)
    this.scrollTrigger = null

    this.init()
    this.handleResize()
  }

  init() {
    // SP時は無効化
    if (this.mql.matches) return

    // ScrollTriggerとLenisを連携
    if (this.lenis) {
      this.lenis.on('scroll', ScrollTrigger.update)
    }

    // Lenisを使う場合はScrollerProxyを設定
    const self = this
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          if (self.lenis) {
            self.lenis.scrollTo(value, { immediate: true })
          } else {
            window.scrollTo(0, value)
          }
        }
        return self.lenis ? self.lenis.scroll : window.pageYOffset || document.documentElement.scrollTop
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    })

    this.setupHorizontalScroll()

    if (this.options.progressBarSelector) {
      this.setupProgressBar()
    }

    ScrollTrigger.refresh()
  }

  setupHorizontalScroll() {
    const maxScroll = this.track.scrollWidth - this.track.clientWidth
    const wrapper = this.options.wrapperElement || this.container.parentElement

    // 画面の高さに応じて固定位置を調整
    const topOffset = this.calculateTopOffset()

    this.scrollTrigger = ScrollTrigger.create({
      trigger: wrapper,
      start: `top top+=${topOffset}`,
      end: () => `+=${maxScroll}`,
      pin: wrapper,
      pinSpacing: true,
      scrub: this.options.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress
        const x = progress * maxScroll
        this.track.style.transform = `translateX(-${x}px)`
      }
    })
  }

  setupProgressBar() {
    const progressFill = document.querySelector(this.options.progressBarSelector)
    if (!progressFill) return

    const wrapper = this.options.wrapperElement || this.container.parentElement
    const topOffset = this.calculateTopOffset()

    ScrollTrigger.create({
      trigger: wrapper,
      start: `top top+=${topOffset}`,
      end: () => `+=${this.track.scrollWidth - this.track.clientWidth}`,
      scrub: this.options.scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress * 100
        progressFill.style.width = `${progress}%`
      }
    })
  }

  calculateTopOffset() {
    // 画面高さに応じて固定位置を調整
    const viewportHeight = window.innerHeight
    const minOffset = this.options.topOffset
    const maxOffset = this.options.topOffsetMax
    const threshold = this.options.topOffsetViewportThreshold

    if (viewportHeight > threshold) {
      return Math.min(maxOffset, minOffset + (viewportHeight - threshold) * 0.1)
    }
    return minOffset
  }

  handleResize() {
    this.mql.addEventListener('change', (e) => {
      if (e.matches) {
        // SPに切り替わった場合、ScrollTriggerを無効化
        this.destroy()
      } else {
        // PCに切り替わった場合、再初期化
        this.init()
      }
    })

    // リサイズ時にScrollTriggerをリフレッシュ
    let resizeTimer
    window.addEventListener('resize', () => {
      if (!this.mql.matches) {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh()
        }, 100)
      }
    })
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill()
      this.scrollTrigger = null
    }
    ScrollTrigger.getAll().forEach(st => {
      // このインスタンスに関連するものだけを削除
      if (st.trigger === (this.options.wrapperElement || this.container.parentElement)) {
        st.kill()
      }
    })
    if (this.track) {
      this.track.style.transform = ''
    }
  }

  // 手動でリフレッシュ
  refresh() {
    ScrollTrigger.refresh()
  }
}
