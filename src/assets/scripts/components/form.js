/**
 * リアルタイムフォームのAlpine.jsコンポーネント
 */
export function createForm() {
  return {
    name: '',
    message: '',

    get nameDisplay() {
      return this.name || '未入力';
    },

    get messageDisplay() {
      return this.message || '未入力';
    },

    get messageLength() {
      return this.message.length;
    },
  };
}

// フォームコンポーネントのHTML
export const formHTML = `
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
`;
