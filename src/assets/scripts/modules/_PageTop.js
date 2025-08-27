/* eslint-disable */

const defaultConfig = {
  showThreshold: 200,
  throttleDelay: 100,
}

// Object.assign を使用してオブジェクトをマージ
function deepMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export default class PageTop {
  constructor(element, config) {
    this.element = element
    this.config = deepMerge({}, defaultConfig, config || {})
    this.scrollRoot = 'scrollingElement' in document ? document.scrollingElement : document.documentElement
  }

  init() {
    if (!this.element) return

    this._handleEvent()
    this._handleScroll()
  }

  _handleEvent() {
    // スクロールイベント
    window.addEventListener('scroll', this._throttle(this._handleScroll.bind(this), this.config.throttleDelay))

    // クリックイベント
    this.element.addEventListener('click', this._scrollToTop.bind(this))
  }

  _handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop

    if (scrollY > this.config.showThreshold) {
      this.element.classList.add('is-show')
    } else {
      this.element.classList.remove('is-show')
    }
  }

  _scrollToTop(e) {
    e.preventDefault()

    this.scrollRoot.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // パフォーマンス最適化のためのthrottle関数
  _throttle(func, delay) {
    let timeoutId
    let lastExecTime = 0

    return (...args) => {
      const currentTime = Date.now()

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(this, args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }
}
