const mongoose = require("mongoose");
const { Redis } = require("ioredis");

const client = new Redis();

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options={}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(Object.assign(
    {}, 
    this.getQuery(), 
    {collection: this.mongooseCollection.name}
  ));
  const cacheValue = await client.hget(this.hashKey, key);
  if (cacheValue) {
    // console.log("CACHE");
    const parsedValue = JSON.parse(cacheValue);
    if (Array.isArray(parsedValue)) {

    }
    return Array.isArray(parsedValue)
    ? parsedValue.map(item => new this.model(item))
    : new this.model(parsedValue);
  }
  // console.log("DB");
  const result = await exec.apply(this, arguments);
  await client.hset(this.hashKey, key, JSON.stringify(result));
  return result;
}

module.exports = {
  async clearHash(hashKey) {
    await client.del(JSON.stringify(hashKey));
  }
}