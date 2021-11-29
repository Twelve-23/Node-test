const express = require('express');
const NodeCache = require('node-cache');
const data = require('./data.json');

const app = express();
const port = 3000;
const myCache = new NodeCache();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

function getData(res, month, summary) {
  const out = [];
  Object.keys(data.periods).forEach((key) => {
    const startMonth = Number(data.periods[key].period.start.split('-')[1]);
    const endMonth = Number(data.periods[key].period.end.split('-')[1]);
    if (startMonth === month && endMonth === month) {
      out.push(summary === 'true' ? data.periods[key].summary : data.periods[key].itemized);
    }
  });
  myCache.set('cachedKey', out);
  myCache.set('cachedMonth', month);
  myCache.set('cachedSummary', summary);
  return res.json(out);
}

app.get('/getData', (req, res) => {
  const [month, summary] = [Number(req.query.month), req.query.summary];
  if (!month) {
    res.send('Missing Month Parameter');
    return;
  }
  if (myCache.has('cachedKey') && myCache.has('cachedMonth') && myCache.has('cachedSummary')) {
    if (myCache.get('cachedMonth') === month && myCache.get('cachedSummary') === summary) {
      const out = myCache.get('cachedKey');
      res.json(out);
    } else {
      getData(res, month, summary);
    }
  } else {
    getData(res, month, summary);
  }
});

app.listen(port, () => {});
