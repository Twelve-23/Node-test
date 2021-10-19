const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 10 });

const setCache = (key, value) => cache.set(key, value);

const getCacheKey = (month, isSummaryRequested) => `month_${month}_${isSummaryRequested ? 'summary' : 'itemized'}`;

const getCache = (key) => cache.get(key);

const hasCache = (key) => cache.has(key);

module.exports = { getCacheKey, getCache, setCache, hasCache };
