const express = require('express');
const app = express();
const port = 3000;
const client = require('./redisconnection')
const data = require('./data.json');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/getData', async (req, res) => {
  try {
    const month = Number(req.query.month);
    const summary = req.query.summary;
    if (!month) {
      res.send('Missing Month Parameter');
      return;
    } else if (summary) {
      if (summary === true || summary === "true") {
        var getSummary = await client.get("GET_SUMMARY");
        if (getSummary) {
          res.json(JSON.parse(getSummary));
        } else {
          var returnSummary = await sendSummary(month);
          await client.set("GET_SUMMARY", JSON.stringify(returnSummary));
          res.json(returnSummary);
        }
      } else {
        res.send('Missing summary Value');
        return;
      }
    } else {
      if (summary === "") {
        res.send('Missing summary Value');
        return;
      } else {
        var getItem = await client.get("GET_ITEM");
        if (getItem) {
          res.json(JSON.parse(getItem));
        } else {
          var returnPeriods = await sendPeriods(month);
          await client.set("GET_ITEM", JSON.stringify(returnPeriods));
          res.json(returnPeriods);
        }
      }
    }
  } catch (error) {
    res.sendStatus(500).json({ errormsg: error })
  }
});

async function sendPeriods(month) {
  try {
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
      out.push(period.itemized);
    }
    return out;
  } catch (error) {
    return [];
  }
};

async function sendSummary() {
  try {
    let out = [];
    for (let summaries of data.periods) {
      out.push(summaries.summary);
    }
    return out;
  } catch (error) {
    return [];
  }
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
