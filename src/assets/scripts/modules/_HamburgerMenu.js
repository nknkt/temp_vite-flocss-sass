/**
 * ハンバーガーメニュー
 */
export default class HamburgerMenu {
  /**
   * @param {HTMLElement} hamburger - ハンバーガーボタン要素
   * @param {HTMLElement} navMenu - ナビゲーションメニュー要素
   * @param {Object} options - オプション
   * @param {HTMLElement} navBg - ナビゲーション背景要素
   */
  constructor(hamburger, navMenu, options = {}, navBg = null) {
    // 要素の存在チェック
    if (!hamburger || !navMenu) {
      throw new Error('HamburgerMenu: Required elements not found')
    }

    this.hamburger = hamburger
    this.navMenu = navMenu
    this.navBg = navBg
    this.isOpen = false
    this.scrollPosition = 0

    // デフォルト設定
    this.options = {
      bodyClass: 'is-menu-open',
      breakpoint: 768,
      debounceDelay: 100,
      ...options
    }

    // イベントハンドラーのバインド（メモリリーク対策）
    this.handleHamburgerClick = this.handleHamburgerClick.bind(this)
    this.handleMenuLinkClick = this.handleMenuLinkClick.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleResize = this.debounce(this.handleResize.bind(this), this.options.debounceDelay)
    this.handleOverlayClick = this.handleOverlayClick.bind(this)
    this.preventScrollOutsideNav = this.preventScrollOutsideNav.bind(this)

    // メニューリンクの取得（一度だけ）
    this.menuLinks = this.navMenu.querySelectorAll('a')
  }

  /**
   * 初期化
   */
  init() {
    this.bindEvents()
    this.setupAccessibility()
  }

  /**
   * アクセシビリティの設定
   */
  setupAccessibility() {
    // ARIA属性の設定
    this.hamburger.setAttribute('aria-expanded', 'false')
    this.hamburger.setAttribute('aria-controls', this.navMenu.id || 'nav-menu')
    this.hamburger.setAttribute('aria-label', 'メニューを開く')

    if (!this.navMenu.id) {
      this.navMenu.id = 'nav-menu'
    }
  }

  /**
   * イベントバインド
   */
  bindEvents() {
    // ハンバーガーボタンクリック
    this.hamburger.addEventListener('click', this.handleHamburgerClick)

    // メニュー内のリンククリック時にメニューを閉じる
    this.menuLinks.forEach(link => {
      link.addEventListener('click', this.handleMenuLinkClick)
    })

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', this.handleKeydown)

    // ウィンドウリサイズ時にメニューを閉じる（PC表示時）
    window.addEventListener('resize', this.handleResize)

    // オーバーレイクリックでメニューを閉じる
    document.addEventListener('click', this.handleOverlayClick)

    // ナビ外でのスクロールキー制御用のハンドラー
    this.handleScrollKeysOutsideNav = (e) => {
      if (this.isOpen && [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        // フォーカスされた要素がナビ内かどうかチェック
        if (!this.navMenu.contains(document.activeElement)) {
          if (e.keyCode !== 27) { // ESCキー以外
            e.preventDefault()
            return false
          }
        }
      }
    }
  }

  /**
   * イベントハンドラー: ハンバーガーボタンクリック
   */
  handleHamburgerClick(e) {
    e.preventDefault()
    e.stopPropagation()
    this.toggle()
  }

  /**
   * イベントハンドラー: メニューリンククリック
   */
  handleMenuLinkClick() {
    this.close()
  }

  /**
   * イベントハンドラー: キーダウン
   */
  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close()
    }
  }

  /**
   * イベントハンドラー: ウィンドウリサイズ
   */
  handleResize() {
    if (window.innerWidth > this.options.breakpoint && this.isOpen) {
      this.close()
    }
  }

  /**
   * イベントハンドラー: オーバーレイクリック
   */
  handleOverlayClick(e) {
    if (this.isOpen && !this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
      this.close()
    }
  }

  /**
   * debounce関数
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  /**
   * メニューの開閉を切り替え
   */
  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  /**
   * ナビ外でのスクロール防止関数
   */
  preventScrollOutsideNav(e) {
    // イベントがナビ内で発生した場合
    if (this.navMenu.contains(e.target)) {
      // スクロール可能な要素（p-nav-header-menu）を探す
      const scrollableElement = e.target.closest('.p-nav-header-menu__inner')

      if (scrollableElement) {
        // スクロール位置と要素の高さを取得
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement
        const isAtTop = scrollTop === 0
        const isAtBottom = scrollTop + clientHeight >= scrollHeight

        // wheelイベントの場合
        if (e.type === 'wheel') {
          const deltaY = e.deltaY

          // 上スクロールで既に最上部にいる場合、または
          // 下スクロールで既に最下部にいる場合はイベントを止める
          if ((deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom)) {
            e.preventDefault()
            return false
          }
        }

        // touchmoveイベントの場合
        if (e.type === 'touchmove') {
          // タッチイベントの方向判定は複雑なので、安全のため常に許可
          // ただし、スクロール範囲外への移動は防ぐ
          const touch = e.touches[0]
          if (this.lastTouchY) {
            const deltaY = this.lastTouchY - touch.clientY
            if ((deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom)) {
              e.preventDefault()
              return false
            }
          }
          this.lastTouchY = touch.clientY
        }

        // ナビ内でのスクロールは許可
        return
      }
    }

    // ナビ外または非スクロール要素内でのスクロールは禁止
    e.preventDefault()
    return false
  }

  /**
   * メニューを開く
   */
  open() {
    // 現在のスクロール位置を記録
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop

    // タッチイベント用の変数を初期化
    this.lastTouchY = null

    this.isOpen = true
    this.hamburger.classList.add('is-active')
    this.navMenu.classList.add('is-active')
    document.body.classList.add(this.options.bodyClass)

    // ナビ外でのスクロールイベントを無効化（ナビ内は許可）
    document.addEventListener('wheel', this.preventScrollOutsideNav, { passive: false })
    document.addEventListener('touchmove', this.preventScrollOutsideNav, { passive: false })
    document.addEventListener('keydown', this.handleScrollKeysOutsideNav)

    // 既存のnavBg機能
    if (this.navBg) {
      this.navBg.classList.add('is-active')
    }

    // アクセシビリティの更新
    this.hamburger.setAttribute('aria-expanded', 'true')
    this.hamburger.setAttribute('aria-label', 'メニューを閉じる')

    // フォーカス管理
    this.navMenu.focus()
  }

  /**
   * メニューを閉じる
   */
  close() {
    this.isOpen = false
    this.hamburger.classList.remove('is-active')
    this.navMenu.classList.remove('is-active')
    document.body.classList.remove(this.options.bodyClass)

    // スクロールイベントを復活
    document.removeEventListener('wheel', this.preventScrollOutsideNav, { passive: false })
    document.removeEventListener('touchmove', this.preventScrollOutsideNav, { passive: false })
    document.removeEventListener('keydown', this.handleScrollKeysOutsideNav)

    // スクロール位置を復元
    window.scrollTo(0, this.scrollPosition)

    // 既存のnavBg機能
    if (this.navBg) {
      this.navBg.classList.remove('is-active')
    }

    // アクセシビリティの更新
    this.hamburger.setAttribute('aria-expanded', 'false')
    this.hamburger.setAttribute('aria-label', 'メニューを開く')
  }

  /**
   * イベントリスナーを削除してクリーンアップ
   */
  destroy() {
    // イベントリスナーの削除
    this.hamburger.removeEventListener('click', this.handleHamburgerClick)

    this.menuLinks.forEach(link => {
      link.removeEventListener('click', this.handleMenuLinkClick)
    })

    document.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('click', this.handleOverlayClick)
    window.removeEventListener('resize', this.handleResize)

    // スクロール制御のイベントリスナーも削除
    document.removeEventListener('wheel', this.preventScrollOutsideNav, { passive: false })
    document.removeEventListener('touchmove', this.preventScrollOutsideNav, { passive: false })
    document.removeEventListener('keydown', this.handleScrollKeysOutsideNav)

    // 状態をリセット
    if (this.isOpen) {
      this.close()
    }
  }
}
