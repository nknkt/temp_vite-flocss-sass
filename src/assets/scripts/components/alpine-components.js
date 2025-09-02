/**
 * Alpine.js コンポーネント管理ファイル
 */
import { createCounter } from './counter.js';
import { createToggle } from './toggle.js';
import { createForm } from './form.js';
import { createList } from './list.js';
import { createTabs } from './tabs.js';

/**
 * Alpine.jsコンポーネントを初期化
 */
export function initAlpineComponents() {
  // Alpineが利用可能になったときにコンポーネントを登録
  document.addEventListener('alpine:init', () => {
    // グローバルにコンポーネント関数を登録
    window.createCounter = createCounter;
    window.createToggle = createToggle;
    window.createForm = createForm;
    window.createList = createList;
    window.createTabs = createTabs;
  });
}

/**
 * コンポーネントのHTMLを動的に挿入
 */
export function renderAlpineComponents(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with id "${containerId}" not found`);
    return;
  }

  // 各コンポーネントのHTMLを動的に生成
  const components = [
    {
      title: 'カウンター',
      html: `
        <section x-data="createCounter()" class="alpine-sample">
          <h2>カウンター</h2>
          <p>現在のカウント: <span x-text="count" class="count-display"></span></p>
          <button x-on:click="increment()" class="btn btn-primary">+1</button>
          <button x-on:click="decrement()" class="btn btn-danger">-1</button>
          <button x-on:click="reset()" class="btn btn-secondary">リセット</button>
        </section>
      `,
    },
    {
      title: '表示/非表示切り替え',
      html: `
        <section x-data="createToggle()" class="alpine-sample">
          <h2>表示/非表示切り替え</h2>
          <button x-on:click="toggle()" class="btn btn-success" x-text="buttonText"></button>
          <div x-show="isVisible" x-transition class="toggle-content">
            <p>この要素は動的に表示/非表示が切り替わります！</p>
          </div>
        </section>
      `,
    },
    {
      title: 'リアルタイムフォーム',
      html: `
        <section x-data="createForm()" class="alpine-sample">
          <h2>リアルタイムフォーム</h2>
          <div class="form-group">
            <label for="name-input">名前:</label>
            <input id="name-input" x-model="name" type="text" placeholder="あなたの名前を入力" class="form-input">
          </div>
          <div class="form-group">
            <label for="message-input">メッセージ:</label>
            <textarea id="message-input" x-model="message" placeholder="メッセージを入力" class="form-textarea"></textarea>
          </div>
          <div class="form-preview">
            <h3>入力内容のプレビュー:</h3>
            <p><strong>名前:</strong> <span x-text="nameDisplay"></span></p>
            <p><strong>メッセージ:</strong> <span x-text="messageDisplay"></span></p>
            <p><strong>文字数:</strong> <span x-text="messageLength"></span>文字</p>
          </div>
        </section>
      `,
    },
    {
      title: '動的リスト',
      html: `
        <section x-data="createList()" class="alpine-sample">
          <h2>動的リスト</h2>
          <div class="list-input">
            <input x-model="newItem" @keyup.enter="addItem()" type="text" placeholder="新しいアイテムを追加" class="form-input">
            <button x-on:click="addItem()" class="btn btn-primary">追加</button>
          </div>
          <ul class="item-list">
            <template x-for="(item, index) in items" :key="index">
              <li class="item">
                <span x-text="item"></span>
                <button x-on:click="removeItem(index)" class="btn btn-danger btn-small">削除</button>
              </li>
            </template>
          </ul>
          <p><strong>合計:</strong> <span x-text="itemCount"></span> 個のアイテム</p>
        </section>
      `,
    },
    {
      title: 'タブ切り替え',
      html: `
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
      `,
    },
  ];

  // HTMLを生成して挿入
  const html = components.map(component => component.html).join('\n');
  container.innerHTML = html;
}
