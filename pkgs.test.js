const { pkgsNames, pkgsObject, getPage } = require("./pkgs");

function sorted(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) return false;
  }
  return true;
}

test("pkgs is sorted", () => {
  expect(sorted([1, 2, 3, 3, 4])).toBe(true);
  expect(sorted([1, 3, 4, 2])).toBe(false);
  expect(sorted(pkgsNames)).toBe(true);
});

test("getpkgs search", () => {
  // 五个结果
  console.log(getPage("zone", 1, 100).result.map((pkg) => pkg.name));
  expect(getPage("zone", 1, 100).result.length).toBeGreaterThanOrEqual(5);

  expect(getPage("zone", 1, 2).result.length).toBe(2);
  expect(getPage("zone", 2, 2).result.length).toBe(2);
  expect(getPage("zone", 3, 2).result.length).toBe(1);
});

test("pkg contains desc and vers", () => {
  console.log(JSON.stringify(pkgsObject.magit, null, 2));

  expect(pkgsObject.magit.desc).toBeDefined();
  expect(pkgsObject.magit.vers).toBeDefined();
});

test("getpkgs search by keyword", () => {
  // 一个结果 0blayout
  expect(getPage(undefined, 1, 100, "window-management").result.length).toBe(1);
});

test("author", () => {
  console.log("Authors of rg:", pkgsObject.rg.props.authors);
});
