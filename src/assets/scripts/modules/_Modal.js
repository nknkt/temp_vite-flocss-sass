/**
 * Modal/Drawer管理クラス
 * モダンな<dialog>要素を使用したモーダル・ドロワーの制御
 */
export default class Modal {
  constructor() {
    this.triggers = document.querySelectorAll('.js-modal-trigger');
    this.closeBtns = document.querySelectorAll('.js-modal-close');
    this.dialogs = document.querySelectorAll('dialog[id]');

    this.init();
  }

  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', e => {
        const targetId = e.currentTarget.dataset.target;
        const dialog = document.getElementById(targetId);

        if (dialog) {
          this.open(dialog);
        }
      });
    });

    this.closeBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        const dialog = e.currentTarget.closest('dialog');
        if (dialog) {
          this.close(dialog);
        }
      });
    });

    this.dialogs.forEach(dialog => {
      dialog.addEventListener('click', e => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;

        if (!isInDialog) {
          this.close(dialog);
        }
      });

      dialog.addEventListener('cancel', e => {
        e.preventDefault();
        this.close(dialog);
      });
    });
  }

  open(dialog) {
    dialog.showModal();
    requestAnimationFrame(() => {
      dialog.classList.add('is-open');
    });
  }

  close(dialog) {
    dialog.classList.remove('is-open');

    dialog.addEventListener(
      'transitionend',
      () => {
        dialog.close();
      },
      { once: true },
    );
  }
}
