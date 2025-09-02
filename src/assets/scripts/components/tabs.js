/**
 * タブ切り替えのAlpine.jsコンポーネント
 */
export function createTabs() {
  return {
    activeTab: 'tab1',

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    isActive(tab) {
      return this.activeTab === tab;
    },
  };
}

// タブコンポーネントのHTML
export const tabsHTML = `
<section x-data="createTabs()" class="alpine-sample">
  <h2>タブ切り替え</h2>
  <div class="tab-buttons">
    <button x-on:click="setActiveTab('tab1')" :class="{ 'active': isActive('tab1') }" class="tab-button">タブ1</button>
    <button x-on:click="setActiveTab('tab2')" :class="{ 'active': isActive('tab2') }" class="tab-button">タブ2</button>
    <button x-on:click="setActiveTab('tab3')" :class="{ 'active': isActive('tab3') }" class="tab-button">タブ3</button>
  </div>
  <div class="tab-content">
    <div x-show="isActive('tab1')" x-transition class="tab-panel">
      <h3>タブ1の内容</h3>
      <p>これは最初のタブの内容です。Alpine.jsのx-showディレクティブを使用して表示を切り替えています。</p>
    </div>
    <div x-show="isActive('tab2')" x-transition class="tab-panel">
      <h3>タブ2の内容</h3>
      <p>2番目のタブの内容です。トランジション効果も付いています。</p>
    </div>
    <div x-show="isActive('tab3')" x-transition class="tab-panel">
      <h3>タブ3の内容</h3>
      <p>3番目のタブです。Alpine.jsは非常にシンプルで強力ですね！</p>
    </div>
  </div>
</section>
`;
