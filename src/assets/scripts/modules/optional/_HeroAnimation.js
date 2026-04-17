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
    this.maskOverlay = document.querySelector('.js-hero-mask-overlay')
    this.ring1 = document.querySelector('.js-hero-ring-1')
    this.ring2 = document.querySelector('.js-hero-ring-2')
    this.particleCanvas = document.querySelector('.js-hero-particle')
    this.headerImg = document.querySelector('.js-hero-header-img')

    this.currentRadius = 0
  }

  async init() {
    if (!this.hero) return

    this.initRadius = window.innerHeight * 0.4
    this.currentRadius = this.initRadius
    this.finalRadius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)

    this.setupScrollAnimations()
    await this.playEntrance()
  }

  playEntrance() {
    const tl = gsap.timeline({ delay: 0.3 })

    // 1. 円の写真 + リング フェードイン
    tl.to([this.centerWrapper, this.ring1, this.ring2], {
      opacity: 1,
      duration: 0.6,
      ease: 'none',
      force3D: true
    })

    // maskOverlayは円のフェードイン完了後に即表示（mix-blend-modeの同時アニメ回避）
    tl.set(this.maskOverlay, { opacity: 1 })

    // 2. テキスト + パーティクル + ヘッダー画像 フェードイン
    tl.to([this.copy, this.newsImg, this.particleCanvas, this.headerImg], {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '+=0.2')

    return tl.then()
  }

  setupScrollAnimations() {
    // マスク拡大完了までのスクロール距離（px）
    const maskScrollDist = window.innerHeight * 0.2

    ScrollTrigger.create({
      trigger: this.hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const scrolled = self.progress * (self.end - self.start)
        const t = Math.min(scrolled / maskScrollDist, 1)

        // clip-pathでマスク拡大
        const radius = this.initRadius + t * (this.finalRadius - this.initRadius)
        this.currentRadius = radius
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
        if (scrolled > maskScrollDist) {
          this.mainTitle.classList.add('is-white')
        } else {
          this.mainTitle.classList.remove('is-white')
        }
      },
      onLeave: () => {
        // bgLoopなどは消さない（最後のセクションの下敷きとして使い回すため）
      },
      onEnterBack: () => {
        // bgLoopなどは消さない
      }
    })

    // sub-text フェードイン（マスク完了直後〜+200pxで完了）
    if (this.subText) {
      gsap.to(this.subText, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: this.hero,
          start: `top+=${maskScrollDist} top`,
          end: `top+=${maskScrollDist + 100} top`,
          scrub: true
        }
      })
    }

    // news フェードアウト（0〜200pxで完了）
    if (this.newsImg) {
      gsap.to(this.newsImg, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: this.hero,
          start: 'top top',
          end: 'top+=200 top',
          scrub: true
        }
      })
    }

    // mask-overlay フェードアウト（0〜maskScrollDistで完了）
    if (this.maskOverlay) {
      gsap.to(this.maskOverlay, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: this.hero,
          start: 'top top',
          end: `top+=${maskScrollDist} top`,
          scrub: true
        }
      })
    }
  }

  destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
}