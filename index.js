/**
 * ユーザー情報を受け取り画面に表示させる関数
 */
async function main() {
  try {
    const userId = getUserId();
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch {
    console.error(`エラーが発生しました(${error})`);
  }
}

/**
 * ユーザー情報を取得する関数
 * @param {string} userId 情報を取得したいGitHubユーザーのIDを指定します
 */
function fetchUserInfo(userId) {
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
      } else {
        return response.json();
      }
    });
}

/**
 * 入力された値を返す関数
 * @return {string} 入力されたユーザーID
 */
function getUserId() {
  return document.getElementById('js-userId').value;
}

/**
 * 引数に渡されたユーザー情報をもとにhtmlを生成する関数
 * @param {Object} userInfo 取得したユーザー情報
 * @return {HTMLElement} エスケープ処理されたhtml文字列
 */
function createView(userInfo) {
  return escapeHTML
    `<h4>${userInfo.name}(@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

/**
 * 取得したhtml文字列を対象のDOM要素の子要素に配置する関数
 * @param {string} view html文字列
 */
function displayView(view) {
  const result = document.getElementById('js-result');
  result.innerHTML = view;
}

/**
 * テンプレートリテラル内のhtml文字列をエスケープする関数
 * @param {string} str html文字列
 */
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * タグ付きテンプレート関数
 * @param {string} strings html文字列の配列
 * @param {string} values 埋め込まれる値の配列
 */
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}