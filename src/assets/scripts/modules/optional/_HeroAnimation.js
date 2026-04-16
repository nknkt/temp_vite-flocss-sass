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
    this.header = document.querySelector('.js-hero-header')
    this.logo = document.querySelector('.js-hero-logo')
    this.copy = document.querySelector('.js-hero-copy')
    this.mainTitle = document.querySelector('.js-main-title')
    this.subText = document.querySelector('.js-sub-text')
    this.news = document.querySelector('.js-hero-news')
    this.blurOverlay = document.querySelector('.js-blur-overlay')

    this.loopAnimations = []
  }

  init() {
    if (!this.hero) return

    this.setupBackgroundLoop()
    this.setupScrollAnimations()
  }

  show() {
    // オープニング後に要素を表示
    const tl = gsap.timeline()

    tl.to(this.bgLoop, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    })

    tl.to(this.centerWrapper, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')

    tl.to([this.header, this.logo], {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')

    tl.to(this.copy, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')

    tl.to(this.news, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
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
    // スクロールに応じて円形マスクを拡大し、画像をズームイン
    ScrollTrigger.create({
      trigger: this.hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress

        // 円形マスクを拡大（最終的に画面幅の150%まで）
        const scale = 1 + (progress * 2.5)
        gsap.set(this.circleMask, {
          scale: scale
        })

        // 画像を少しズームイン
        const imgScale = 1 + (progress * 0.3)
        gsap.set(this.circleImg, {
          scale: imgScale
        })

        // テキストカラーを変更（progress 0.4以降で白に）
        if (progress > 0.4) {
          this.mainTitle.classList.add('is-white')
          this.subText.classList.add('is-white')
        } else {
          this.mainTitle.classList.remove('is-white')
          this.subText.classList.remove('is-white')
        }
      }
    })
  }

  destroy() {
    // ループアニメーションを停止
    this.loopAnimations.forEach(anim => anim.kill())
    this.loopAnimations = []

    // ScrollTriggerをクリーンアップ
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
}
