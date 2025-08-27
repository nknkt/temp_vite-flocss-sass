/**
 * DOM操作で画像アイテムのクローンを作成して無限ループを実現するクラス
 */
export default class ItemImagesClone {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      // クローンする回数（オリジナルを含めて何セット表示するか）
      cloneCount: 2,
      ...options,
    };

    this.trackElement = null;
    this.originalItems = [];
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.trackElement = this.element.querySelector('.p-product-gallery__track');
    if (!this.trackElement) {
      console.warn('Track element not found');
      return;
    }

    // オリジナルのアイテムを保存
    this.originalItems = Array.from(this.trackElement.children);

    // クローンを作成
    this.createClones();

    this.isInitialized = true;
  }

  createClones() {
    // 指定された回数分クローンを作成
    for (let i = 0; i < this.options.cloneCount; i++) {
      this.originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        this.trackElement.appendChild(clone);
      });
    }
  }

  destroy() {
    if (!this.isInitialized) return;

    // クローンを削除してオリジナルのみに戻す
    this.trackElement.innerHTML = '';
    this.originalItems.forEach(item => {
      this.trackElement.appendChild(item);
    });

    this.isInitialized = false;
  }
}
