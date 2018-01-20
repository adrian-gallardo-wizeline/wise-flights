const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

const SkyScannerFetcher = require('./SkyScannerFetcher');

const PROVIDERS = {
  SKYSCANNER: 'SKYSCANNER',
  // EDREAMS: 'EDREAMS',
};
const MAX_RETRIES = 3;

app.get('/awake', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
  init();
  console.log('Example app listening on port 3000!');
});

async function init() {
  const jobs = await getJobs();
  const results = [];

  await processJobs(jobs, results);

  console.log('done');
}

async function getJobs() {
  return axios.get(process.env.API_URL + '/job', {
    params: {
      completed: false
    }
  }).then(response => {
    return response.data;
  });
}

async function processJobs(jobs, results){
  const job = jobs.shift();
  let result;

  const jobProcessor = new JobProcessor(job, PROVIDERS);

  try {
    result = await jobProcessor.process();
    results.push(result);
  } catch (e){
    console.log('Error processJobs')
  }

  console.log('Result processJobs', result);

  console.log('Pending jobs...', jobs.length);
  if(jobs.length > 0){
    await processJobs(jobs, results);
  }
  
}

class JobProcessor {
  constructor(job, providers){
    this.job = job;
    this.jobProvidersQueue = [];
    this.providers = providers;
  }

  async process(){
    const jobQueue = [];
    
    Object.values(this.providers).forEach(async provider => {
      const jobFetcherProvider = this.getJobFetcherProvider(this.job, provider);
      jobQueue.push(jobFetcherProvider.fetch());
    });
    return Promise.all(jobQueue).then(prices => {
      let bestPrice = null;
      prices.forEach(price => {
        if(price){
          if(!bestPrice){
            bestPrice = price;
          } else {
            bestPrice = price;
          }
        }
      });
      console.log('bestPrice', bestPrice);
      return Promise.resolve(bestPrice);
    });
  }

  getJobFetcherProvider(job, provider){
    switch(provider){
      case PROVIDERS.SKYSCANNER:
        return new FetcherStrategyRetry(SkyScannerFetcher, MAX_RETRIES, job);
      case PROVIDERS.EDREAMS:
        return new FetcherStrategyRetry(EDreamsFetcher, MAX_RETRIES, job);
      break;
    }
  }
}

class FetcherStrategyRetry {
  constructor(FetcherClass, maxRetries, job){
    this.fetcherInstance = new FetcherClass()
    this.job = job;
    this.maxRetries = maxRetries;
    this.attempts = 0;
  }

  async fetch(){
    this.attempts++;
    let result;
    
    if(this.attempts > this.maxRetries){
      return Promise.resolve(null);
    } else {
      try {
        result = await this.fetcherInstance.process(this.job);
        console.log('Result', result);
      } catch (e){
        console.log('Error', e);
        console.log('Retrying...', this.attempts + 1);
        result = await this.fetch();
        console.log('Result 2', result);
      }
      return result;
    }
  }
}