export default class IntroTextAnimate {
  constructor(selector = '.js-animate-text') {
    this.selector = selector
  }

  wrapTextToSpan(element) {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        node.textContent.split('').forEach(char => {
          if (char === ' ' || char === '\n') {
            frag.appendChild(document.createTextNode(char))
          } else {
            const span = document.createElement('span')
            span.className = 'js-animate-char'
            span.style.opacity = '0.2'
            span.textContent = char
            frag.appendChild(span)
          }
        })
        node.parentNode.replaceChild(frag, node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk)
      }
    }
    walk(element)
  }

  animate() {
    const targets = document.querySelectorAll(this.selector)
    targets.forEach(target => {
      this.wrapTextToSpan(target)
      const chars = target.querySelectorAll('.js-animate-char')
      const total = chars.length

      const onScroll = () => {
        const rect = target.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const startPoint = windowHeight * 0.9 // 画面の10%位置で開始
        const endPoint = windowHeight * 0.4 // 画面の60%位置で完了

        // 要素の上端が startPoint を通過してから endPoint まででアニメーション
        let progress = (startPoint - rect.top) / (startPoint - endPoint)
        progress = Math.min(Math.max(progress, 0), 1)

        const visibleCount = Math.floor(progress * total)
        chars.forEach((char, i) => {
          char.style.opacity = i < visibleCount ? 1 : 0.2
        })
      }

      window.addEventListener('scroll', onScroll)
      onScroll() // 初期表示
    })
  }
}
