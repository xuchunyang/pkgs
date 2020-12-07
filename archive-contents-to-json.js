const debug = require("debug")("pkgs");
const axios = require("axios");
const fs = require("fs");

fs.mkdirSync("data", { recursive: true });
process.chdir("data");

async function download(elpa) {
  fs.mkdirSync(elpa, { recursive: true });
  const url = `https://mirrors.tuna.tsinghua.edu.cn/elpa/${elpa}/archive-contents`;
  const filename = `${elpa}/archive-contents`;
  debug("Downloading %s to %s ...", url, filename);
  const response = await axios({
    url,
    responseType: "stream",
  });
  response.data.pipe(fs.createWriteStream(filename));
  debug("Done");
  return filename;
}

(async () => {
  await download("gnu");
  await download("melpa");
  await download("melpa-stable");
})();
