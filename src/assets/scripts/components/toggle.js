/**
 * 表示/非表示切り替えのAlpine.jsコンポーネント
 */
export function createToggle() {
  return {
    isVisible: false,

    toggle() {
      this.isVisible = !this.isVisible;
    },

    get buttonText() {
      return this.isVisible ? '隠す' : '表示する';
    },
  };
}

// トグルコンポーネントのHTML
export const toggleHTML = `
<section x-data="createToggle()" class="alpine-sample">
  <h2>表示/非表示切り替え</h2>
  <button x-on:click="toggle()" class="btn btn-success" x-text="buttonText"></button>
  <div x-show="isVisible" x-transition class="toggle-content">
    <p>この要素は動的に表示/非表示が切り替わります！</p>
  </div>
</section>
`;
