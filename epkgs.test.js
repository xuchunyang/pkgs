const epkgs = require("./epkgs");

test("commitUrl - github", () => {
  expect(
    epkgs.commitUrl("magit", "acfe22ab60a56c61aae3ca6d4f2b7b826fe3b071")
  ).toBe(
    "https://github.com/magit/magit/commit/acfe22ab60a56c61aae3ca6d4f2b7b826fe3b071"
  );
});

test("commitUrl - gitlab", () => {
  expect(
    epkgs.commitUrl(
      "bbdb-csv-import",
      "dbc2e0fe9e8ae65e494011044d905ae79b3cee3e"
    )
  ).toBe(
    "https://gitlab.com/iankelling/bbdb-csv-import/commit/dbc2e0fe9e8ae65e494011044d905ae79b3cee3e"
  );
});

test("commitUrl - sr.ht - 不支持 - 没有 repopage 数据", () => {
  expect(
    epkgs.commitUrl("0x0", "996f822a7c6a7ff7caf49ee537e92c0d01be1f9c")
  ).toBeUndefined();
});

test("commitUrl - elpa,savannah - 不支持 - 有 repopage 数据", () => {
  expect(
    epkgs.commitUrl(
      "auto-overlays",
      // 只有 melpa 才提供 commit 信息
      undefined
    )
  ).toBeUndefined();
});
