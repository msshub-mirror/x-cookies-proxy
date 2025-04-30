const express = require('express');
const fs = require('fs');
const { fetchPage } = require('./browser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json({ limit: '200kb' }));

// Cookie保存API
app.post('/set-cookies', (req, res) => {
  fs.writeFileSync('./cookies.json', JSON.stringify(req.body, null, 2));
  res.send('Cookie 保存完了');
});

// x.comページ取得API
app.get('/xproxy', async (req, res) => {
  const url = req.query.url;
  if (!url || !url.startsWith('https://x.com')) {
    return res.status(400).send('無効なURLです');
  }

  try {
    const html = await fetchPage(url);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('取得失敗: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
