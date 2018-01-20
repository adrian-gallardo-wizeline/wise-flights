class FetcherStrategyRetry {
  constructor(FetcherClass, maxRetries, job) {
    this.fetcherInstance = new FetcherClass()
    this.job = job;
    this.maxRetries = maxRetries;
    this.attempts = 0;
  }

  async fetch() {
    this.attempts++;
    let result;

    if (this.attempts > this.maxRetries) {
      return Promise.resolve(null);
    } else {
      try {
        result = await this.fetcherInstance.process(this.job);
        console.log('Result', result);
      } catch (e) {
        console.log('Error', e);
        console.log('Retrying...', this.attempts + 1);
        result = await this.fetch();
        console.log('Result 2', result);
      }
      return result;
    }
  }
}

module.exports = FetcherStrategyRetry;