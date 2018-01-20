const constants = require('../constants');

const FetcherStrategyRetry = require('./FetcherStrategyRetry');

const SkyScannerFetcher = require('./SkyScannerFetcher');
const EDreamsFetcher = require('./EDreamsFetcher');
const KayakFetcher = require('./KayakFetcher');

class JobProcessor {
  constructor(job, providers) {
    this.job = job;
    this.jobProvidersQueue = [];
    this.providers = providers;
  }

  async process() {
    const jobQueue = [];

    Object.values(this.providers).forEach(async provider => {
      const jobFetcherProvider = this.getJobFetcherProvider(this.job, provider);
      jobQueue.push(jobFetcherProvider.fetch());
    });
    return Promise.all(jobQueue).then(results => {
      let bestResult = null;
      results.forEach(result => {
        if (result.price) {
          if (!bestResult) {
            bestResult = result;
          } else if (result.price < bestResult.price) {
            bestResult = result;
          }
        }
      });
      console.log('bestResult', bestResult);
      return Promise.resolve(bestResult);
    });
  }

  getJobFetcherProvider(job, provider) {
    switch (provider) {
      case constants.PROVIDERS.SKYSCANNER:
        return new FetcherStrategyRetry(SkyScannerFetcher, constants.MAX_RETRIES, job);
      case constants.PROVIDERS.EDREAMS:
        return new FetcherStrategyRetry(EDreamsFetcher, constants.MAX_RETRIES, job);
      case constants.PROVIDERS.KAYAK:
        return new FetcherStrategyRetry(KayakFetcher, constants.MAX_RETRIES, job);

    }
  }
}

module.exports = JobProcessor;