const express = require("express");
const nodeCahce = require("node-cache");
const app = express();
const port = 3000;

const data = require("./data.json");

// const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new nodeCahce({ stdTTL: 0 });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getData", (req, res) => {
  const month = Number(req.query.month);
  const summary = req.query.summary;
  if (!month) {
    res.send("Missing Month Parameter");
    return;
  }

  var key = `_getData_${month}`;
  if (summary === "true") {
    var key = `_getData_${month}_summary`;
  }

  let out = [];
  if (!cache.has(key)) {
    for (let period of data.periods) {
      const startMonth = Number(period.period.start.split("-")[1]);
      const endMonth = Number(period.period.end.split("-")[1]);
      if (startMonth !== month || endMonth !== month) {
        continue;
      }

      if (summary === "true") {
        out.push(period.summary);
      } else {
        out.push(period.itemized);
      }
    }
    cache.set(key, out);
    res.json(out);
  } else {
    res.json(cache.get(key));
  }
});

app.get("/flushCache", (req, res) => {
  const previousKeys = cache.keys();
  cache.flushAll();
  res.json({
    previousKeys,
    message: "Cache cleared!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
