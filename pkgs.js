const debug = require("debug")("pkgs");
const fs = require("fs");

const elpas = {
  gnu: "https://elpa.gnu.org/packages/",
  melpa: "https://melpa.org/packages/",
  "melpa-stable": "https://stable.melpa.org/packages/",
};

const elpasMirror = {
  gnu: "https://mirrors.tuna.tsinghua.edu.cn/elpa/gnu/",
  melpa: "https://mirrors.tuna.tsinghua.edu.cn/elpa/melpa/",
  "melpa-stable": "https://mirrors.tuna.tsinghua.edu.cn/elpa/melpa-stable/",
};

function getPkgs() {
  const pkgs = {};
  for (const elpa in elpas) {
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
    const pkg = pkgs[name];

    sortedPkgs[name] = pkg;

    for (const elpa in elpas) {
      if (pkg[elpa] && pkg[elpa].desc) {
        pkg.desc = pkg[elpa].desc;
        break;
      }
    }

    for (const elpa in elpas) {
      if (pkg[elpa] && pkg[elpa].props && pkg[elpa].props.url) {
        pkg.url = pkg[elpa].props.url;
        break;
      }
    }

    pkg.props = {};
    for (const elpa in elpas) {
      if (pkg[elpa] && pkg[elpa].props) {
        Object.assign(pkg.props, pkg[elpa].props);
        delete pkg.props.url;
        break;
      }
    }

    for (const elpa in elpas) {
      if (pkg[elpa] && pkg[elpa].deps) {
        pkg.deps = {};
        const deps = pkg[elpa].deps;
        for (const name in deps) {
          const ver = deps[name].join(".");
          pkg.deps[name] = { name, ver };
        }
        break;
      }
    }

    pkg.vers = {};
    for (const elpa in elpas) {
      if (pkg[elpa]) {
        const name = pkg[elpa].ver.join(".");
        // http://mirrors.tuna.tsinghua.edu.cn/elpa/melpa/package-build-20201206.2137.tar
        const ext = pkg[elpa].type === "single" ? ".el" : ".tar";
        const url = elpas[elpa] + pkg.name + "-" + name + ext;
        pkg.vers[elpa] = { name, elpa, url };
      }
    }

    const commentaryFile = `./data/commentary/${pkg.name}`;
    if (fs.existsSync(commentaryFile)) {
      pkg.commentary = fs.readFileSync(commentaryFile, "utf8");
    }
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

module.exports = {
  pkgsObject,
  pkgsArray,
  pkgsNames,
  getPage,
  elpas,
  elpasMirror,
};
