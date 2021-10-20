const express = require('express');
const app = express();
const port = 3000;
const flatCache = require('flat-cache')


const data = require('./data.json');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

// app.get('/getData', (req, res) => {
//   const month = Number(req.query.month);
//   const summary = req.query.summary;
//   if(!month){
//     res.send('Missing Month Parameter');
//     return;
//   }
//   let out = [];
//   for(let period of data.periods){
//     const startMonth = Number(period.period.start.split('-')[1]);
//     const endMonth = Number(period.period.end.split('-')[1]);
  
//     if(startMonth !== month){
//       continue;
//     }
//     if(endMonth !== month){
//       continue;
//     }
//     if(!summary) {
//       out.push(period.itemized);
//     }
//    else {
//       out.push(period.summary)
//     }
//  }

//   res.json(out);
// })


    // load new cache
let cache = flatCache.load('productsCache');

    // configure cache middleware
    let flatCacheMiddleware = (req,res, next) => {
        let key =  '__express__' + req.originalUrl || req.url
        let cacheContent = cache.getKey(key);
        if(cacheContent){
          res.send(cacheContent);
          return
        }else{
          res.sendResponse = res.send
          res.send = (body) => {
            cache.setKey(key,body);
            cache.save();
            res.sendResponse(body);
          }
          next()
        }
      }



app.get('/getData', flatCacheMiddleware, (req, res) => {
  const month = Number(req.query.month);
  const summary = req.query.summary;
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
    if(!summary) {
      out.push(period.itemized);
    }
   else {
      out.push(period.summary)
    }
 }

  res.json(out);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})