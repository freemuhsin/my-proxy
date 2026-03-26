const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h2>Proxy</h2>
    <form method="GET" action="/proxy">
      <input name="url" placeholder="https://example.com" style="width:300px"/>
      <button>Go</button>
    </form>
  `);
});

app.use('/proxy', (req, res, next) => {
  let target = req.query.url;

  if (!target) return res.send("No URL");

  if (!target.startsWith("http")) {
    target = "https://" + target;
  }

  createProxyMiddleware({
    target: target,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/proxy': '',
    },
  })(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
