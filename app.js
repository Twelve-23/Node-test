const express = require('express');
const app = express();
const port = 3000;
const cache = require('memory-cache');
const duration = 60;  // minutes 
const data = require('./data.json');
let memCache = new cache.Cache();
let cacheMiddleware = () => {
	return (req, res, next) => {
		let key =  '__test__' + req.originalUrl || req.url
		let cacheContent = memCache.get(key);
		if(cacheContent){
			res.json( JSON.parse(cacheContent) );
			return
		}else{
			res.sendResponse = res.send
			res.send = (body) => {
				memCache.put(key,body,duration*1000);
				res.sendResponse(body)
			}
			next()
		}
	}
}
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getData', cacheMiddleware(), (req, res) => {
  const month = Number(req.query.month);
  const summary = (req.query.summary  === 'true');
  if(!month){
    res.send('Missing Month Parameter');
    return;
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
	if (summary) {
      out.push(period.summary)
    } else {
	  out.push(period.itemized);
	}
  }
  res.json(out);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})