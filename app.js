const express = require('express');
const app = express();
const port = 3000;
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const data = require('./data.json');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

function getData(req, res, month, summary){
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
    out.push(summary=='true' ? period.summary : period.itemized);
  }
  myCache.set('cachedKey', out);
  myCache.set('cachedMonth', month);
  myCache.set('cachedSummary', summary);
  return res.json(out);
}

app.get('/getData', (req, res) => {
  const month = Number(req.query.month);
  const summary = req.query.summary;
  if(!month){
    res.send('Missing Month Parameter');
    return;
  }
  if(myCache.has('cachedKey') && myCache.has('cachedMonth') && myCache.has('cachedSummary')){
    if(myCache.get('cachedMonth')==month && myCache.get('cachedSummary')==summary){
      let out = myCache.get('cachedKey');
      res.json(out);
    }else{
      return getData(req, res, month, summary);  
    }
  }else{
    return getData(req, res, month, summary);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})