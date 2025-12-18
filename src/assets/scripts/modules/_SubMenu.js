/**
 * サブメニュー（ドロップダウン/アコーディオン）
 * PC: ホバーで表示
 * SP: クリックでアコーディオン展開
 */
export default class SubMenu {
  constructor(selector = '.js-submenu-toggle') {
    this.toggles = document.querySelectorAll(selector);
  }

  init() {
    // SP時のみクリックイベントを追加
    this.toggles.forEach(toggle => {
      toggle.addEventListener('click', e => {
        // PC表示時はクリック無効
        if (window.innerWidth >= 768) return;

        e.preventDefault();
        e.stopPropagation();

        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const submenu = toggle.nextElementSibling;

        if (submenu && submenu.classList.contains('l-navigation__submenu')) {
          // 状態を切り替え
          toggle.setAttribute('aria-expanded', !isExpanded);
          submenu.classList.toggle('is-open');
        }
      });
    });
  }
}
