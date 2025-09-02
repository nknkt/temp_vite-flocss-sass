/**
 * 動的リストのAlpine.jsコンポーネント
 */
export function createList() {
  return {
    items: ['りんご', 'バナナ', 'みかん'],
    newItem: '',

    addItem() {
      if (this.newItem.trim()) {
        this.items.push(this.newItem.trim());
        this.newItem = '';
      }
    },

    removeItem(index) {
      this.items.splice(index, 1);
    },

    get itemCount() {
      return this.items.length;
    },
  };
}

// リストコンポーネントのHTML
export const listHTML = `
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
`;
