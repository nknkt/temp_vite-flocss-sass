// vendors
import Lenis from 'lenis'

// optional
import OpeningAnimation from '../modules/optional/_OpeningAnimation.js'
import HeroAnimation from '../modules/optional/_HeroAnimation.js'
import SectionAnimation from '../modules/optional/_SectionAnimation.js'

// ============================================================
// Lenis初期化（スムーススクロール）
// ============================================================
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

// ============================================================
// アニメーション初期化
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  // オープニングアニメーション
  const openingAnimation = new OpeningAnimation()
  await openingAnimation.init()

  // ヒーローアニメーション
  const heroAnimation = new HeroAnimation()
  heroAnimation.init()

  // セクションアニメーション
  const sectionAnimation = new SectionAnimation()
  sectionAnimation.init()
})