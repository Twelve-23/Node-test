const express = require('express');
const app = express();
const port = 3000;
const NodeCache = require("node-cache");
const myCache = new NodeCache({ checkperiod: 60 });

const data = require('./data.json');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getData', (req, res) => {
  const month = Number(req.query.month);
  const summary = req.query.summary;

  //Generating key for first time request
  let Key  = `month_${month}`
  if (summary === "true") {
  console.log('used summary true condition')
  Key = `month_${month}_summary`;
  }

  if(!month){
    res.send('Missing Month Parameter');
    return;
  }

  console.log(myCache.keys())
  //When we get value from cache 
  let value = myCache.get(Key)
  if (value) {
    console.log('cache function is used')
    const data = myCache.get(Key)
    return res.json(data);
  }

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
    out.push(summary === 'true' ? period.summary : period.itemized);
  }
  myCache.set(Key,out);
  res.json(out);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})