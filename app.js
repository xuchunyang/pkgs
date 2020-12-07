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

// IDEA ajax to avoid full page reload?
app.get("/", (req, res) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  debug("%o", { search, page });
  const { result, maxPage } = pkgs.getPage(search, page, 50);
  const locals = {
    pkgs: result,
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
