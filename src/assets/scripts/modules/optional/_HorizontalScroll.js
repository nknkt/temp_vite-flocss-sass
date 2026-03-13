/**
 * 横スクロール制御
 * マウスホイールによる縦スクロールを横スクロールに変換
 */
export default class HorizontalScroll {
  /**
   * @param {Object} options - オプション
   * @param {string} options.containerSelector - 横スクロールコンテナのセレクター
   * @param {string} options.trackSelector - スクロールするトラック要素のセレクター
   * @param {string} options.disabledBodyClass - 横スクロールを無効化するbodyクラス名
   */
  constructor(options = {}) {
    this.options = {
      containerSelector: options.containerSelector || '.js-horizontal-scroll',
      trackSelector: options.trackSelector || '.js-horizontal-track',
      disabledBodyClass: options.disabledBodyClass || 'is-nav-open'
    }

    this.tracks = []
    this.boundHandleWheel = this.handleWheel.bind(this)
  }

  /**
   * 初期化
   */
  init() {
    const containers = document.querySelectorAll(this.options.containerSelector)

    containers.forEach(container => {
      const track = container.querySelector(this.options.trackSelector)
      if (!track) return

      this.tracks.push({
        container,
        track,
        currentX: 0
      })
    })

    if (this.tracks.length > 0) {
      window.addEventListener('wheel', this.boundHandleWheel, { passive: false })
    }
  }

  /**
   * ホイールイベントハンドラー
   * @param {WheelEvent} e - ホイールイベント
   */
  handleWheel(e) {
    // 無効化クラスがある場合は横スクロールを無効化
    if (document.body.classList.contains(this.options.disabledBodyClass)) {
      return
    }

    let shouldPreventDefault = false

    this.tracks.forEach(obj => {
      const { track } = obj
      const trackRect = track.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const maxScroll = track.scrollWidth - track.clientWidth

      // スクロール可能な要素でない場合はスキップ
      if (maxScroll <= 1) return

      // トラックが画面内に表示されている場合のみ動作
      const isInView =
        (e.deltaY > 0 && trackRect.bottom <= windowHeight && trackRect.top < windowHeight) ||
        (e.deltaY < 0 && trackRect.top >= 0 && trackRect.bottom <= windowHeight)

      if (isInView) {
        const nextX = obj.currentX + e.deltaY

        // 端に到達していない、または端から戻る方向の場合は横スクロール
        if (nextX > 0 && nextX < maxScroll) {
          // 横スクロールを実行
          shouldPreventDefault = true
          obj.currentX = nextX
          track.style.transform = `translateX(-${obj.currentX}px)`
        } else if ((nextX <= 0 && obj.currentX > 0) || (nextX >= maxScroll && obj.currentX < maxScroll)) {
          // 端にぴったり合わせる
          shouldPreventDefault = true
          obj.currentX = Math.max(0, Math.min(nextX, maxScroll))
          track.style.transform = `translateX(-${obj.currentX}px)`
        }
        // それ以外（完全に端にいて、さらに同じ方向）は縦スクロールを許可
      }
    })

    if (shouldPreventDefault) {
      e.preventDefault()
    }
  }

  /**
   * 破棄
   */
  destroy() {
    window.removeEventListener('wheel', this.boundHandleWheel)

    // トラックの位置をリセット
    this.tracks.forEach(obj => {
      obj.track.style.transform = ''
      obj.currentX = 0
    })

    this.tracks = []
  }
}
