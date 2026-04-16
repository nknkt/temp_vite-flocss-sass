import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default class HeroAnimation {
  constructor() {
    this.hero = document.querySelector('.p-hero')
    this.bgLoop = document.querySelector('.js-bg-loop')
    this.trackTop = document.querySelector('.js-bg-track-top')
    this.trackBottom = document.querySelector('.js-bg-track-bottom')
    this.centerWrapper = document.querySelector('.js-hero-center')
    this.circleMask = document.querySelector('.js-circle-mask')
    this.circleImg = document.querySelector('.js-circle-img')
    this.mainTitle = document.querySelector('.js-main-title')
    this.subText = document.querySelector('.js-hero-sub-text')
    this.overlay = document.querySelector('.p-hero__overlay')
    this.copy = document.querySelector('.js-hero-copy')
    this.message = document.querySelector('.js-hero-message')
    this.newsImg = document.querySelector('.js-hero-news-img')
    this.ring1 = document.querySelector('.js-hero-ring-1')
    this.ring2 = document.querySelector('.js-hero-ring-2')

    this.loopAnimations = []
  }

  init() {
    if (!this.hero) return

    this.initRadius = window.innerHeight * 0.4
    this.finalRadius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
    gsap.set(this.centerWrapper, { clipPath: `circle(${this.initRadius}px at 50% 50%)` })
    gsap.set([this.ring1, this.ring2], { xPercent: -50, yPercent: -50 })

    this.setupBackgroundLoop()
    this.setupScrollAnimations()
  }

  setupBackgroundLoop() {
    if (!this.trackTop || !this.trackBottom) return

    // 上段：左方向にループ
    const topWidth = this.trackTop.scrollWidth / 2
    const loopTop = gsap.to(this.trackTop, {
      x: -topWidth,
      duration: 60,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % topWidth)
      }
    })
    this.loopAnimations.push(loopTop)

    // 下段：右方向にループ
    const bottomWidth = this.trackBottom.scrollWidth / 2
    const loopBottom = gsap.to(this.trackBottom, {
      x: bottomWidth,
      duration: 60,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % bottomWidth)
      }
    })
    this.loopAnimations.push(loopBottom)
  }

  setupScrollAnimations() {
    const maskExitAt = 0.1

    ScrollTrigger.create({
      trigger: this.hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const t = Math.min(progress / maskExitAt, 1)

        // clip-pathでマスク拡大（scale不使用 → 画像ズームに影響しない）
        const radius = this.initRadius + t * (this.finalRadius - this.initRadius)
        gsap.set(this.centerWrapper, { clipPath: `circle(${radius}px at 50% 50%)` })

        // リングをマスクとずらした倍率で拡大
        const ringScale = radius / this.initRadius
        gsap.set(this.ring1, { scale: 1 + (ringScale - 1) * 0.7 })
        gsap.set(this.ring2, { scale: 1 + (ringScale - 1) * 1.3 })

        // 画像を5%ズーム＋ソフトに暗く＋ブラー
        gsap.set(this.circleImg, {
          scale: 1 + t * 0.05,
          filter: `brightness(${1 - t * 0.2}) blur(${t * 2}px)`
        })

        // マスク退場後にテキスト白
        if (progress > maskExitAt) {
          this.mainTitle.classList.add('is-white')
        } else {
          this.mainTitle.classList.remove('is-white')
        }
      },
      onLeave: () => {
        this.bgLoop.style.visibility = 'hidden'
        this.overlay.style.visibility = 'hidden'
        this.centerWrapper.style.visibility = 'hidden'
        if (this.ring1) this.ring1.style.visibility = 'hidden'
        if (this.ring2) this.ring2.style.visibility = 'hidden'
      },
      onEnterBack: () => {
        this.bgLoop.style.visibility = ''
        this.overlay.style.visibility = ''
        this.centerWrapper.style.visibility = ''
        if (this.ring1) this.ring1.style.visibility = ''
        if (this.ring2) this.ring2.style.visibility = ''
      }
    })

    // sub-text フェードイン/アウト（上下どちらも対応）
    if (this.subText) {
      const maskExitPct = maskExitAt * 100
      ScrollTrigger.create({
        trigger: this.hero,
        start: `${maskExitPct}% top`,
        end: `${maskExitPct + 8}% top`,
        scrub: true,
        onUpdate: (self) => {
          gsap.set(this.subText, { opacity: self.progress })
        }
      })
    }

    // news フェードアウト
    if (this.newsImg) {
      ScrollTrigger.create({
        trigger: this.hero,
        start: 'top top',
        end: '5% top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(this.newsImg, { opacity: 1 - self.progress })
        }
      })
    }
  }

  destroy() {
    this.loopAnimations.forEach(anim => anim.kill())
    this.loopAnimations = []
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
}