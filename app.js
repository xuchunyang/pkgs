const debug = require("debug")("pkgs");
const express = require("express");
const morgan = require("morgan");
const pkgs = require("./pkgs");

const app = express();
app.use(morgan("dev"));

// TODO 直接用 Caddy 处理
// http://127.0.0.1:3000/api/gnu/archive-contents.json
app.use("/api", express.static("data"));

app.set("view engine", "pug");
app.set("views", "views");

app.get("/", (req, res) => {
  // TODO 不完善，干脆先去掉
  // if (req.query.page && !/^\d+$/.test(req.query.page)) {
  //   res.status(404);
  //   throw new Error(`No such page: ${req.query.page}`);
  // }
  const page = parseInt(req.query.page) || 1;
  debug("Page: %d", page);
  const numPerPage = 50;
  const maxPage = Math.ceil(pkgs.pkgsArray.length / numPerPage);
  debug("maxPage: %d", maxPage);
  const locals = {
    pkgs: pkgs.getPage(page, numPerPage),
    page,
    maxPage,
  };
  res.render("index", locals);
});

const server = app.listen(
  process.env.PORT || 3000,
  process.env.HOST || "localhost",
  () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}/`);
  }
);
