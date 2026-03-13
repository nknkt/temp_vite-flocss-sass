/**
 * Modal - 基本的なモーダル実装
 * Lenis対応、ESCキーで閉じる、オーバーレイクリックで閉じるなどの基本機能を搭載
 * 
 * @example 基本的な使い方
 * const modal = new Modal({
 *   trigger: '.js-modal-trigger',
 *   modal: '.js-modal',
 *   close: '.js-modal-close'
 * })
 * 
 * @example Lenis対応
 * const modal = new Modal({
 *   trigger: '.js-modal-trigger',
 *   modal: '.js-modal',
 *   close: '.js-modal-close',
 *   lenis: lenisInstance
 * })
 * 
 * @example 複数モーダル
 * const modals = Modal.initAll({
 *   trigger: '.js-modal-trigger',
 *   modal: '.js-modal',
 *   close: '.js-modal-close'
 * })
 */
export default class Modal {
  constructor(options = {}) {
    // オプション設定
    this.options = {
      trigger: null,                    // トリガーボタンのセレクタまたは要素
      modal: null,                      // モーダル要素のセレクタまたは要素
      close: null,                      // 閉じるボタンのセレクタ
      lenis: null,                      // Lenisインスタンス
      openClass: 'is-open',            // モーダルを開いた時のクラス
      closeOnOverlay: true,            // オーバーレイクリックで閉じる
      closeOnEsc: true,                // ESCキーで閉じる
      preventScroll: true,             // body のスクロールを無効化
      onOpen: null,                    // 開いた時のコールバック
      onClose: null,                   // 閉じた時のコールバック
      ...options
    }

    // 要素取得
    this.trigger = this.getElement(this.options.trigger)
    this.modal = this.getElement(this.options.modal)
    this.closeButton = this.options.close ? this.modal?.querySelector(this.options.close) : null
    this.lenis = this.options.lenis

    if (!this.modal) {
      console.warn('Modal: モーダル要素が見つかりません')
      return
    }

    this.init()
  }

  getElement(selector) {
    if (!selector) return null
    if (typeof selector === 'string') {
      return document.querySelector(selector)
    }
    return selector
  }

  init() {
    // トリガーボタンのイベント
    if (this.trigger) {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault()
        this.open()
      })
    }

    // 閉じるボタンのイベント
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.close()
      })
    }

    // オーバーレイクリックで閉じる
    if (this.options.closeOnOverlay) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close()
        }
      })
    }

    // ESCキーで閉じる
    if (this.options.closeOnEsc) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains(this.options.openClass)) {
          this.close()
        }
      })
    }
  }

  open() {
    // Lenisを停止
    if (this.lenis) {
      this.lenis.stop()
    }

    // bodyのスクロールを無効化
    if (this.options.preventScroll) {
      document.body.style.overflow = 'hidden'
    }

    // モーダルを開く
    this.modal.classList.add(this.options.openClass)

    // コールバック実行
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen(this)
    }
  }

  close() {
    // モーダルを閉じる
    this.modal.classList.remove(this.options.openClass)

    // bodyのスクロールを復元
    if (this.options.preventScroll) {
      document.body.style.overflow = ''
    }

    // Lenisを再開
    if (this.lenis) {
      this.lenis.start()
    }

    // コールバック実行
    if (typeof this.options.onClose === 'function') {
      this.options.onClose(this)
    }
  }

  // モーダルが開いているかどうか
  isOpen() {
    return this.modal.classList.contains(this.options.openClass)
  }

  // トグル
  toggle() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  // 複数モーダルを一括初期化
  static initAll(options = {}) {
    const triggers = document.querySelectorAll(options.trigger)
    const instances = []

    triggers.forEach((trigger) => {
      // data-modal-target属性からモーダルを取得
      const modalTarget = trigger.dataset.modalTarget
      if (!modalTarget) return

      const modal = document.querySelector(modalTarget)
      if (!modal) return

      const instance = new Modal({
        ...options,
        trigger,
        modal
      })

      instances.push(instance)
    })

    return instances
  }
}
