"use strict";
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// cashing package
const CacheApi = require('node-filesystem-cache');
const cachePath = path.join(__dirname, 'cache');
const Cache = new CacheApi(cachePath);

// lodash lib
const _ = require('lodash');

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

  // check if has on cash
  if (Cache.has('req')) {
    const requestCash = Cache.get('req');
    const responseCash = Cache.get('res');
    // compare req objects with cash
    if (_.isEqual(req.query, requestCash)) {
      console.log("from cash");
      // return from Cash
      return res.send(Cache.get('res'));
    } else {
      // store req
      Cache.put('req', req.query);
    }
  } else {
    // store req
    Cache.put('req', req.query);
  }
  console.log("from json");
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
      // store in cash
      Cache.put('res', out);
    } else {
      out.push(period.itemized);
      // store in cash
      Cache.put('res', out);
    }
  }
  res.json(out);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})