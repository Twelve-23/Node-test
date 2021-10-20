const express = require("express");
const app = express();
const port = 3000;
const data = require("./data.json");
const NodeCache = require("node-cache");
//checkperiod : expiring the cache after N seconds
const myCache = new NodeCache({ checkperiod: 60 });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getData", (req, res) => {
  const month = Number(req.query.month);
  const summary = Boolean(req?.query?.summary);
  if (!month) {
    res.send("Missing Month Parameter");
    return;
  }

  if (month) {
    //create unique cache key for itemized  & summary data save into cache
    const cacheKey=`month_${month}_summary_${summary}`
    if (myCache.has(cacheKey)) {
      return res.json(myCache.get(cacheKey));
    } else {
      let out = [];
      for (let period of data.periods) {
        const startMonth = Number(period.period.start.split("-")[1]);
        const endMonth = Number(period.period.end.split("-")[1]);
        if (startMonth !== month) {
          continue;
        }
        if (endMonth !== month) {
          continue;
        }
        //If the request contains summary=true then instead of sending the period.itemized data back it should send the period.summary data.
        if (summary) {
          out.push(period.summary);
        } else {
          out.push(period.itemized);
        }
      }
      myCache.set(cacheKey,out);
      return res.json(out);
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
