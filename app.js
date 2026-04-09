const http = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = false;

const app = next({ dev, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, "0.0.0.0", () => {
      // cPanel logs show this line if startup succeeds.
      console.log(`Next.js app running on port ${port}`);
    });
});
