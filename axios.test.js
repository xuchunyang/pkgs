const http = require("http");
const fs = require("fs");
const axios = require("axios");

test("response.data = string", async () => {
  const response = await axios.get("http://example.com/");
  expect(response.headers["content-type"]).toMatch(/text\/html/);
  expect(typeof response.data).toBe("string");
});

test("response.data = object", async () => {
  const response = await axios.get("https://fortune.cadr.xyz/api/fortune");
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(typeof response.data).toBe("object");
});

test("download stream", async () => {
  const response = await axios.get("http://example.com/", {
    responseType: "stream",
  });
  expect(response.data).toBeInstanceOf(http.IncomingMessage);
  response.data.pipe(fs.createWriteStream("/tmp/1x"));
});
