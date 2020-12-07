const debug = require("debug")("pkgs");
const fs = require("fs");

function getPkgs() {
  const pkgs = {};
  for (const elpa of ["gnu", "melpa", "melpa-stable"]) {
    const jsonFile = `./data/${elpa}/archive-contents.json`;
    debug("loading %s ...", jsonFile);
    const contents = fs.readFileSync(jsonFile, "utf8");
    const json = JSON.parse(contents);
    debug("adding %d packages from %s", Object.keys(json).length, elpa);
    for (const name in json) {
      if (!(name in pkgs)) pkgs[name] = { name };
      pkgs[name][elpa] = json[name];
    }
  }
  debug("found total %d packages", Object.keys(pkgs).length);

  const names = Object.keys(pkgs);
  const sortedNames = names
    .slice(0)
    .sort((name1, name2) => (name1 > name2 ? 1 : -1));
  const sortedPkgs = {};
  for (const name of sortedNames) {
    sortedPkgs[name] = pkgs[name];

    sortedPkgs[name].desc =
      pkgs[name].melpa?.desc ||
      pkgs[name].gnu?.desc ||
      pkgs[name]["melpa-stable"]?.desc;
  }

  return sortedPkgs;
}

const pkgsObject = getPkgs();
const pkgsArray = Object.values(pkgsObject);
const pkgsNames = Object.keys(pkgsObject);

function getPage(page, numPerPage) {
  if (!Number.isInteger(page)) throw new Error("Invalid page number");
  if (page < 1) throw new Error("Page number too small");
  const maxPage = Math.ceil(pkgsArray.length / numPerPage);
  if (page > maxPage) throw new Error("Page number too big");

  const skip = (page - 1) * numPerPage;
  return pkgsArray.slice(skip, skip + numPerPage);
}

module.exports = { pkgsObject, pkgsArray, pkgsNames, getPage };
