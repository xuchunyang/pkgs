const { pkgsNames } = require("./pkgs");

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
