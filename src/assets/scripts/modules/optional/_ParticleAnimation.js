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
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.4 + 0.15
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
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
      // 中心から外へ向かう方向を計算
      const dx = p.x - cx
      const dy = p.y - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      p.vx = (dx / dist) * speed
      p.vy = (dy / dist) * speed

      p.x += p.vx
      p.y += p.vy
      p.opacity += p.opacitySpeed
      if (p.opacity > 0.7 || p.opacity < 0.05) p.opacitySpeed *= -1

      // 画面外に出たら中心付近にリスポーン
      if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * 50 + 20
        p.x = cx + Math.cos(angle) * r
        p.y = cy + Math.sin(angle) * r
        p.opacity = 0.05
      }

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
