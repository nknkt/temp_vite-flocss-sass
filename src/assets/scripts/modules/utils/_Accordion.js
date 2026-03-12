/**
 * Accordion - maxHeightを使ったアコーディオン機能
 * シンプルで軽量なアコーディオン実装
 */
export default class Accordion {
  constructor(options = {}) {
    this.options = {
      toggleSelector: '.js-accordion-toggle',
      contentSelector: '.js-accordion-content',
      innerSelector: '.js-accordion-inner',
      ...options,
    }
    this.toggles = document.querySelectorAll(this.options.toggleSelector)
    this.init()
  }

  init() {
    if (!this.toggles.length) return

    this.bindEvents()
    this.setInitialHeights()
    this.bindContentClick()
  }

  setInitialHeights() {
    this.toggles.forEach(toggle => {
      const content = toggle.nextElementSibling
      const inner = content.querySelector(this.options.innerSelector) || content

      // 実際の高さをdata属性として保存
      const height = inner.offsetHeight
      content.dataset.height = height
    })
  }

  bindEvents() {
    this.toggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.handleToggle(toggle))
    })
  }

  bindContentClick() {
    const contents = document.querySelectorAll(this.options.contentSelector)
    contents.forEach(content => {
      content.addEventListener('click', () => {
        const toggle = content.previousElementSibling
        if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
          this.handleToggle(toggle)
        }
      })
    })
  }

  handleToggle(toggle) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true'
    const content = toggle.nextElementSibling
    const height = content.dataset.height

    if (isExpanded) {
      // 閉じる
      content.style.maxHeight = height + 'px'
      toggle.setAttribute('aria-expanded', 'false')

      // ブラウザにレンダリングさせてから0に
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          content.style.maxHeight = '0'
        })
      })

      // アニメーション完了後にaria-hiddenを変更
      content.addEventListener('transitionend', function handleTransitionEnd() {
        if (content.getAttribute('aria-expanded') !== 'true') {
          content.setAttribute('aria-hidden', 'true')
        }
        content.removeEventListener('transitionend', handleTransitionEnd)
      })
    } else {
      // 開く
      content.setAttribute('aria-hidden', 'false')
      toggle.setAttribute('aria-expanded', 'true')

      requestAnimationFrame(() => {
        content.style.maxHeight = height + 'px'
      })

      // アニメーション完了後にautoに設定（コンテンツが可変の場合に対応）
      content.addEventListener('transitionend', function handleTransitionEnd() {
        if (content.getAttribute('aria-hidden') === 'false') {
          content.style.maxHeight = 'none'
        }
        content.removeEventListener('transitionend', handleTransitionEnd)
      })
    }
  }
}
