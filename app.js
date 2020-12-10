const debug = require("debug")("pkgs");
const express = require("express");
const morgan = require("morgan");
const pkgs = require("./pkgs");
const fs = require("fs");
const execa = require("execa");

const app = express();
app.use(morgan("dev"));

// TODO 直接用 Caddy 处理
// http://127.0.0.1:3000/api/gnu/archive-contents.json
// app.use("/api", express.static("data"));

// for debug purpose
app.get("/api/package/:name", (req, res) => {
  res.json(pkgs.pkgsObject[req.params.name]);
});

app.set("view engine", "pug");
app.set("views", "views");

app.locals.datefns = require("date-fns");
const lastUpdated = new Date(
  parseInt(fs.readFileSync("./data/update_timestamp", "utf8")) * 1000
);
app.locals.commit = execa.commandSync("git rev-parse --verify HEAD").stdout;
app.locals.commitDate = new Date(
  execa.commandSync("git show --no-patch --format=%cI HEAD").stdout
);
app.locals.commitUrl =
  "https://github.com/xuchunyang/pkgs/" + app.locals.commit;

// IDEA ajax to avoid full page reload?
app.get("/", (req, res) => {
  const search = req.query.search;
  const keyword = req.query.keyword;
  const author = req.query.author;
  const page = parseInt(req.query.page) || 1;
  debug("%o", { search, page, keyword, author });
  const { result, maxPage } = pkgs.getPage(search, page, 50, keyword, author);
  const locals = {
    search,
    pkgs: result,
    page,
    maxPage,
    lastUpdated,
  };
  res.render("index", locals);
});

app.get("/package/:name", (req, res) => {
  const pkg = pkgs.pkgsObject[req.params.name];
  if (!pkg) {
    throw new Error("No such package");
  }
  res.render("package", { pkg, lastUpdated });
});

const server = app.listen(
  process.env.PORT || 3000,
  process.env.HOST || "localhost",
  () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}/`);
  }
);
