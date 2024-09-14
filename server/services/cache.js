const mongoose = require("mongoose");
const { Redis } = require("ioredis");

const client = new Redis();

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
  this.useCache = true;
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
  const cacheValue = await client.get(key);
  if (cacheValue) {
    // console.log("CACHE");
    const parsedValue = JSON.parse(cacheValue);
    if (Array.isArray(parsedValue)) {

    }
    return Array.isArray(parsedValue)
    ? parsedValue.map(item => new this.model(item))
    : new this.model(parsedValue);
  }
  const result = await exec.apply(this, arguments);
  await client.set(key, JSON.stringify(result));
  return result;
}