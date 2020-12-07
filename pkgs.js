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

// XXX cache search results? worth? if so how?
function getPage(search, page, numPerPage) {
  const skip = (page - 1) * numPerPage;
  let matches;
  if (!search) {
    matches = pkgsArray;
  } else {
    matches = [];
    for (let i = 0; i < pkgsNames.length; i++) {
      if (pkgsNames[i].includes(search)) {
        matches.push(pkgsArray[i]);
      }
    }
  }
  debug("matches.length: %d", matches.length);
  const maxPage = Math.ceil(matches.length / numPerPage);
  const result = matches.slice(skip, skip + numPerPage);
  return { result, maxPage };
}

module.exports = { pkgsObject, pkgsArray, pkgsNames, getPage };
