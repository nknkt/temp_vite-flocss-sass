/**
 * ローディング完了タイミング制御
 * 実際のアニメーションはCSSで実装
 */
export default class LoadingAnimation {
  /**
   * @param {Object} options - オプション
   * @param {string} options.loadingSelector - ローディング要素のセレクター
   * @param {string} options.bodyLoadingClass - body要素に追加するローディング中のクラス
   * @param {string} options.bodyReadyClass - DOMContentLoaded時にbodyに追加するクラス（省略可）
   * @param {string} options.fadeOutClass - フェードアウト開始時に追加するクラス
   * @param {number} options.minDisplayTime - 最低表示時間（ミリ秒）
   * @param {number} options.fadeOutDuration - フェードアウトアニメーション時間（ミリ秒）
   * @param {string} options.completeEventName - 完了時に発火するイベント名
   * @param {boolean} options.resetScrollPosition - スクロール位置をトップに戻すか
   * @param {boolean} options.showOnce - 1回表示したら次回以降スキップするか
   * @param {string} options.storageKey - showOnce用のストレージキー
   */
  constructor(options = {}) {
    this.options = {
      loadingSelector: options.loadingSelector || '.js-loading',
      bodyLoadingClass: options.bodyLoadingClass || 'is-loading',
      bodyReadyClass: options.bodyReadyClass || null,
      fadeOutClass: options.fadeOutClass || 'is-fade-out',
      minDisplayTime: options.minDisplayTime !== undefined ? options.minDisplayTime : 1000,
      fadeOutDuration: options.fadeOutDuration || 1200,
      completeEventName: options.completeEventName || 'loadingComplete',
      resetScrollPosition: options.resetScrollPosition !== undefined ? options.resetScrollPosition : true,
      showOnce: options.showOnce || false,
      storageKey: options.storageKey || 'loadingShown'
    }

    this.loadingElements = document.querySelectorAll(this.options.loadingSelector)
    this.body = document.body
    this.isComplete = false

    this.init()
  }

  /**
   * 初期化
   */
  init() {
    // showOnceオプションが有効で、既に表示済みの場合はスキップ
    if (this.options.showOnce && this.hasShown()) {
      this.skipLoading()
      return
    }

    // スクロール位置をリセット
    if (this.options.resetScrollPosition) {
      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    } else {
      if (history.scrollRestoration) {
        history.scrollRestoration = 'auto'
      }
    }

    // 初期状態を設定
    this.body.classList.add(this.options.bodyLoadingClass)

    // DOMContentLoaded 到達時の処理（オプション）
    if (this.options.bodyReadyClass) {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        this.body.classList.add(this.options.bodyReadyClass)
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.body.classList.add(this.options.bodyReadyClass)
        })
      }
    }

    // ロード完了を待つ
    if (document.readyState === 'complete') {
      this.startAnimation()
    } else {
      window.addEventListener('load', () => {
        this.startAnimation()
      })
    }
  }

  /**
   * 既に表示済みかチェック
   * @returns {boolean}
   */
  hasShown() {
    return sessionStorage.getItem(this.options.storageKey) === 'true'
  }

  /**
   * 表示済みフラグを保存
   */
  markAsShown() {
    sessionStorage.setItem(this.options.storageKey, 'true')
  }

  /**
   * ローディングをスキップ
   */
  skipLoading() {
    this.loadingElements.forEach(el => {
      el.remove()
    })
    this.body.classList.remove(this.options.bodyLoadingClass)
    if (this.options.bodyReadyClass) {
      this.body.classList.remove(this.options.bodyReadyClass)
    }
    this.isComplete = true

    // イベント発火
    const event = new CustomEvent(this.options.completeEventName)
    window.dispatchEvent(event)
  }

  /**
   * フェードアウトアニメーション開始
   */
  startAnimation() {
    const minDisplayTime = this.options.minDisplayTime
    const startTime = Date.now()

    const fadeOut = () => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDisplayTime - elapsed)

      setTimeout(() => {
        // フェードアウト開始
        this.loadingElements.forEach(el => {
          el.classList.add(this.options.fadeOutClass)
        })

        // アニメーション完了後にクリーンアップ
        setTimeout(() => {
          this.loadingElements.forEach(el => {
            el.remove()
          })
          this.body.classList.remove(this.options.bodyLoadingClass)
          if (this.options.bodyReadyClass) {
            this.body.classList.remove(this.options.bodyReadyClass)
          }
          this.isComplete = true

          // showOnceオプションが有効なら表示済みフラグを保存
          if (this.options.showOnce) {
            this.markAsShown()
          }

          // カスタムイベントを発火
          const event = new CustomEvent(this.options.completeEventName)
          window.dispatchEvent(event)
        }, this.options.fadeOutDuration)
      }, remainingTime)
    }

    fadeOut()
  }

  /**
   * アニメーション完了状態を取得
   * @returns {boolean}
   */
  isAnimationComplete() {
    return this.isComplete
  }
}
