export default class OpeningAnimation {
  constructor() {
    this.opening = document.querySelector('.js-opening')
    this.imageSets = document.querySelectorAll('.js-opening-set')
    this.isComplete = false
    this.duration = 1000
    this.wait = 800
  }

  init() {
    if (!this.opening || this.imageSets.length === 0) return

    document.documentElement.style.setProperty('--opening-duration', `${this.duration}ms`)

    return new Promise((resolve) => {
      this.playAnimation(resolve)
    })
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  playAnimation(onComplete) {
    const run = async () => {
      for (let i = 0; i < this.imageSets.length; i++) {
        // セットをリビール
        this.imageSets[i].classList.add('is-revealed')

        // トランジション完了を待つ
        await this.delay(this.duration)

        // 前のセットを隠す
        if (i > 0) {
          this.imageSets[i - 1].style.visibility = 'hidden'
        }

        // 最後のセット以外はウェイト
        if (i < this.imageSets.length - 1) {
          await this.delay(this.wait)
        }
      }

      // 最後のセットをワイプアウト
      await this.delay(this.wait)

      // 背景を透明にしてheroを見せる
      this.opening.style.background = 'transparent'

      const lastSet = this.imageSets[this.imageSets.length - 1]
      lastSet.classList.remove('is-revealed')
      lastSet.classList.add('is-wipe-out')

      await this.delay(this.duration)

      this.isComplete = true
      this.opening.classList.add('is-finished')
      if (onComplete) onComplete()
    }

    run()
  }
}
