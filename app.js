const express = require('express');
const app = express();
const port = 3000;

const data = require('./data.json');
const cache = require('./routeCache');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getData', cache(300), (req, res) => {
  const month = Number(req.query.month);
  const summary = req.query.summary;
  /*if(!month){
    res.send('Missing Month Parameter');
    return;
  }*/
  let out = [];
  for(let period of data.periods){
    const startMonth = Number(period.period.start.split('-')[1]);
    const endMonth = Number(period.period.end.split('-')[1]);
    if(startMonth !== month){
      continue;
    }
    if(endMonth !== month){
      continue;
    }
    out.push(period.summary);
    out.push(period.itemized);
  }
  res.json(out);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})