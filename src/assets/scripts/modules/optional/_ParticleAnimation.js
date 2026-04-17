export default class ParticleAnimation {
  constructor(heroAnimation) {
    this.heroAnimation = heroAnimation
    this.canvas = document.querySelector('.js-hero-particle')
    this.particles = []
    this.raf = null
  }

  init() {
    if (!this.canvas) return

    this.ctx = this.canvas.getContext('2d')
    this.resize()
    this.createParticles()
    this.loop()

    window.addEventListener('resize', () => this.resize())
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    const count = 200
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacitySpeed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      })
    }
  }

  loop() {
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height
    const cx = w / 2
    const cy = h / 2
    const currentRadius = this.heroAnimation?.currentRadius ?? 0

    ctx.clearRect(0, 0, w, h)

    // パーティクル描画
    ctx.globalCompositeOperation = 'source-over'
    this.particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.opacity += p.opacitySpeed
      if (p.opacity > 0.7 || p.opacity < 0.05) p.opacitySpeed *= -1

      // 画面端でループ
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`)
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    })

    // 円の内側を切り抜き（マスクと連動）
    if (currentRadius > 0) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    this.raf = requestAnimationFrame(() => this.loop())
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', () => this.resize())
  }
}
