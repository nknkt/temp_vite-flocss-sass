/**
 * ScrollImageSwitcher - スクロール連動画像切り替え
 * テキストブロックのスクロール位置に応じて対応する画像を切り替える
 * 
 * @example
 * const switcher = new ScrollImageSwitcher(document.querySelector('.js-feature-block'))
 * 
 * @example カスタム設定
 * const switcher = new ScrollImageSwitcher(
 *   document.querySelector('.js-custom-block'),
 *   {
 *     textSelector: '.js-custom-text',
 *     imageSelector: '.js-custom-image',
 *     breakpoint: 1024,
 *     rootMargin: '-30% 0px -30% 0px'
 *   }
 * )
 */
export default class ScrollImageSwitcher {
  constructor(element, options = {}) {
    this.element = element
    if (!this.element) return

    // オプション設定
    this.options = {
      textSelector: '.js-switch-text',        // テキストブロックのセレクタ
      imageSelector: '.js-switch-image',      // 画像のセレクタ
      breakpoint: 768,                        // SPで無効化するブレークポイント
      rootMargin: '-45% 0px -45% 0px',       // 画面のどの位置で切り替えるか
      activeClass: 'is-active',              // 画像に付与するクラス
      ...options
    }

    this.mql = window.matchMedia(`(max-width: ${this.options.breakpoint}px)`)
    this.texts = this.element.querySelectorAll(this.options.textSelector)
    this.images = this.element.querySelectorAll(this.options.imageSelector)
    this.currentIndex = -1

    this.init()
    this.handleResize()
  }

  init() {
    // SPでは無効化
    if (this.mql.matches) return

    this.setupObserver()
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: 0
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(this.texts).indexOf(entry.target)
          if (index !== -1) {
            this.switchImage(index)
          }
        }
      })
    }, options)

    this.texts.forEach((text) => {
      this.observer.observe(text)
    })

    // 初期状態: 最初の画像をアクティブに
    setTimeout(() => {
      if (this.images.length > 0) {
        this.switchImage(0)
      }
    }, 100)
  }

  switchImage(index) {
    if (index === this.currentIndex || !this.images[index]) return

    // すべての画像を非表示
    this.images.forEach((img) => {
      img.classList.remove(this.options.activeClass)
    })

    // 指定された画像を表示
    this.images[index].classList.add(this.options.activeClass)
    this.currentIndex = index
  }

  handleResize() {
    this.mql.addEventListener('change', (e) => {
      if (e.matches) {
        // SPに切り替わった場合、Observerを破棄
        if (this.observer) {
          this.observer.disconnect()
          this.observer = null
        }
        // すべての画像を非表示にリセット
        this.images.forEach((img) => {
          img.classList.remove(this.options.activeClass)
        })
        this.currentIndex = -1
      } else {
        // PCに切り替わった場合、Observerを再初期化
        if (!this.observer) {
          this.setupObserver()
        }
      }
    })
  }
}
