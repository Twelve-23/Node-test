const express = require('express');

// import node-cache npm  module to integrate caching
const nodeCache = require("node-cache");

const app = express();
const port = 3000;

const data = require('./data.json');

// initialize cache with ttl(time to live) for 10 min
const cache = new nodeCache({ stdTTL: 10 * 60 * 1 });

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getData', (req, res) => {
  let out = [];
  const month = Number(req.query.month);
  const isSummary = req.query.summary === "true";

  const key = isSummary ? `_GET_DATA_${month}_SUMMARY` : `_GET_DATA_${month}`;

  if (!month) {
    res.send('Missing Month Parameter');
    return;
  }

  if (!cache.has(key)) {
    for (let period of data.periods) {
      const startMonth = Number(period.period.start.split('-')[1]);
      const endMonth = Number(period.period.end.split('-')[1]);

      if (startMonth !== month) continue;
      if (endMonth !== month) continue;

      isSummary ? out.push(period.summary) : out.push(period.itemized);
    }

    cache.set(key, out);
    return res.json(out);
  } else {

    return res.json(cache.get(key));
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})