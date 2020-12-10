// 读取 epkgs.sqlite3 数据

const debug = require("debug")("pkgs:epkgs");
const path = require("path");
const Database = require("better-sqlite3");

const dbfile = path.join(__dirname, "epkgs.sqlite3");
const db = new Database(dbfile, {
  fileMustExist: true,
  readonly: true,
  verbose: console.log,
});

const stmt = db.prepare("SELECT * FROM melpa_recipes");
const melpa_recipes = stmt.all();
db.close();
debug("# of melpa recipes: %d", melpa_recipes.length);
debug("Package value: %o", melpa_recipes[0]);

module.exports = {
  commitUrl(package_name, commit) {
    // epkgs 的字符串大多加了引号（适用于 Emacs read 函数）
    const recipe = melpa_recipes.find((r) => r.name === `"${package_name}"`);
    if (!recipe) {
      return;
    }
    if (!recipe.repopage) {
      return;
    }
    const repopage_without_quotes = recipe.repopage.slice(
      1,
      recipe.repopage.length - 1
    );
    return `${repopage_without_quotes}/commit/${commit}`;
  },
};
