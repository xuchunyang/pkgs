const debug = require("debug")("pkgs:dl-readme");
const axios = require("axios");
const pkgs = require("./pkgs");
const fs = require("fs");

fs.mkdirSync("data/commentary", { recursive: true });
process.chdir("data/commentary");

(async () => {
  const total = pkgs.pkgsArray.length;
  let i = 1;
  for (const pkg of pkgs.pkgsArray) {
    debug("[%d/%d] %s", i++, total, pkg.name);

    const filename = pkg.name;
    if (fs.existsSync(filename)) {
      debug("%s 已存在，跳过", filename);
      continue;
    }

    let url;
    for (const elpa in pkgs.elpas) {
      if (pkg[elpa]) {
        // const endpoint = pkgs.elpas[elpa];
        const endpoint = pkgs.elpasMirror[elpa];
        // https://melpa.org/packages/magit-readme.txt
        url = `${endpoint}${pkg.name}-readme.txt`;
        // 只下载一个
        break;
      }
    }

    debug("Download %s as %s ...", url, filename);
    try {
      const response = await axios({
        url,
        responseType: "stream",
      });
      response.data.pipe(fs.createWriteStream(filename));
      debug("Done");
    } catch (error) {
      if (error.response?.status === 404) {
        debug("404 跳过");
      } else {
        throw error;
      }
    }
  }
})();
