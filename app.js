const express = require('express');

const { getMonth } = require('./helpers/getMonth');

const { getCacheKey, getCache, setCache, hasCache } = require('./helpers/cache-store');

const app = express();

const { periods } = require('./constants/data.json');

const port = process.env.PORT || 3000;

app.get('/', (_, res) => res.send('App is running'));

app.get('/getData', (req, res) => {
  let { summary, month } = req.query;

  const isSummaryRequested = summary === 'true';

  month = parseInt(month);

  if (!month) {
    res.status(400).json({ error: 'Month is required' });
  }

  const cacheKey = getCacheKey(month, isSummaryRequested);

  if (hasCache(cacheKey)) {
    const result = getCache(cacheKey);
    res.status(200).json(result);
  }
  else{
    res.status(200).json(getData(periods, month, isSummaryRequested, cacheKey));
  }
});

const getData = (periods, month, isSummaryRequested, cacheKey) => {
  const result = [];
  periods.filter(({ itemized, summary, period: { start, end } }) => {
    if (getMonth(start) == month || getMonth(end) == month) {
      if (isSummaryRequested) {
        result.push(summary);
      }
      else {
        result.push(itemized);
      }
    }
  });

  setCache(`${cacheKey}`, result);
  return result;
};

app.listen(port, () => console.log(`App is running on PORT ${port}`));
