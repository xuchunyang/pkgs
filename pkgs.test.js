const { pkgsNames, getPage } = require("./pkgs");

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
  console.log(getPage("zone", 1, 100).map((pkg) => pkg.name));
  expect(getPage("zone", 1, 100).length).toBeGreaterThanOrEqual(5);

  expect(getPage("zone", 1, 2).length).toBe(2);
  expect(getPage("zone", 2, 2).length).toBe(2);
  expect(getPage("zone", 3, 2).length).toBe(1);
});
