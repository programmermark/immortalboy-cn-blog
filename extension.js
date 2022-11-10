const vscode = require("vscode");
const axios = require("axios");

/**
 * 获取文章列表
 */
const fetchArticleList = async () => {
  const res = await axios.post(
    "https://immortalboy.cn/api/blog/articlelist/getArticleList",
    { limit: 1000, offset: 0, type: "全部" }
  );
  let list = [];
  if (res.status === 200 && res.data.success) {
    list = res.data.data.list.map((item) => ({
      label: item.title,
      detail: item.introduce,
      description: item.title,
      link: `https://immortalboy.cn/article-detail/${item.id}`,
    }));
  }
  return list;
};

/**
 * tlhba33j6eyw6bjm2k6tsqwr6qxse4iglhjy7ngk24ixpis6lymq
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // 获取所有文章
  const allArticles = await fetchArticleList();

  let disposable = vscode.commands.registerCommand(
    "immortalboy-cn-blog.listArticles",
    async function () {
      const article = await vscode.window.showQuickPick(allArticles, {
        matchOnDetail: true,
      });
      if (article == null) {
        return;
      }

      vscode.env.openExternal(article.link);
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
