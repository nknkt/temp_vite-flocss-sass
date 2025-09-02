/**
 * カウンター機能のAlpine.jsコンポーネント
 */
export function createCounter() {
  return {
    count: 0,

    increment() {
      this.count++;
    },

    decrement() {
      this.count--;
    },

    reset() {
      this.count = 0;
    },
  };
}

// カウンターコンポーネントのHTML
export const counterHTML = `
<section x-data="createCounter()" class="alpine-sample">
  <h2>カウンター</h2>
  <p>現在のカウント: <span x-text="count" class="count-display"></span></p>
  <button x-on:click="increment()" class="btn btn-primary">+1</button>
  <button x-on:click="decrement()" class="btn btn-danger">-1</button>
  <button x-on:click="reset()" class="btn btn-secondary">リセット</button>
</section>
`;
