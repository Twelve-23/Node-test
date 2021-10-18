"use strict";
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// caching package
const CacheApi = require('node-filesystem-cache');
const cachePath = path.join(__dirname, 'cache');
const Cache = new CacheApi(cachePath);

const data = require('./data.json');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getData', (req, res) => {
  const month = Number(req.query.month);
  const summary = req.query.summary;
  if (!month) {
    res.send('Missing Month Parameter');
    return;
  }

  let keyName = `${month}`
  if (summary && (summary == "true" || summary == true)) {
    keyName = `${keyName}-summary`
  } else {
    keyName = `${keyName}-periods`
  }

  // check if has on cache
  if (Cache.has(keyName)) {
    res.json(Cache.get(keyName));
    console.log("from cache", keyName);
  } else {
    let out = [];
    for (let period of data.periods) {
      const startMonth = Number(period.period.start.split('-')[1]);
      const endMonth = Number(period.period.end.split('-')[1]);
      if (startMonth !== month) {
        continue;
      }
      if (endMonth !== month) {
        continue;
      }
      // if summary is given
      if (summary && (summary == "true" || summary == true)) {
        out.push(period.summary);
        // store in cache
        Cache.put(keyName, out);
      } else {
        out.push(period.itemized);
        // store in cache
        Cache.put(keyName, out);
      }
    }
    res.json(out);
    console.log("from json");
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})