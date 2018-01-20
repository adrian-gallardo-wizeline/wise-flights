const axios = require('axios');

const JobProcessor = require('./JobProcessor');

const constants = require('../constants');

class FetcherApp {

  constructor(){
    this.results = [];
  }

  getResults(){
    return this.results;
  }

  async processJobs(jobs) {
    const job = jobs.shift();
    let result;

    const jobProcessor = new JobProcessor(job, constants.PROVIDERS);

    try {
      result = await jobProcessor.process();
      this.saveJobResult(job, result);
      this.results.push(result);
    } catch (e) {
      console.log('Error processJobs')
    }

    console.log('Result processJobs', result);
  
    console.log('Pending jobs...', jobs.length);
    if (jobs.length > 0) {
      await this.processJobs(jobs, this.results);
    }
  }

  async saveJobResult(job, result){
    const newData = {
      completed: true,
      price: result,
      provider: 'EDREAMS',
    };
    const url = process.env.API_URL + '/job/' + job.id;
    console.log('update job', url, newData);
    return axios.put(url, newData).then(response => {
      return response.data;
    });
  }
}

module.exports = FetcherApp;