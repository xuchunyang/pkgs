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

const stmt = db.prepare("SELECT name, repopage FROM packages");
const packages = stmt.all();
db.close();
debug("# of Packages: %d", packages.length);
debug("Package value: %o", packages[0]);
debug(
  "# of Packages: %o",
  packages.find((p) => p.repopage === null)
);

module.exports = {
  commitUrl(package_name, commit) {
    // epkgs 的字符串大多加了引号（适用于 Emacs read 函数）
    const pkg = packages.find((p) => p.name === `"${package_name}"`);
    if (!pkg) {
      // epkgs 好像是按 repo 组织的，比如没有 git-commit 这个包，它包含在 magit repo 中国呢
      // debug("epkgs 数据库没有收录 %s", package_name);
      //
      // FIXME 还不如直接用 melpa 的方案，支持 git-commit
      // https://melpa.org/recipes.json
      return;
    }
    if (!pkg.repopage) {
      return;
    }
    if (!/github\.com\/|gitlab\.com\/|sr\.hr\//.test(pkg.repopage)) {
      return;
    }
    const repopage_without_quotes = pkg.repopage.slice(
      1,
      pkg.repopage.length - 1
    );
    return `${repopage_without_quotes}/commit/${commit}`;
  },
};
