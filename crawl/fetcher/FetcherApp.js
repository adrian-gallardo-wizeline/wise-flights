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

    if (jobs.length === 0) {
      return;
    }
    
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
    
    //Volvemos a llamar al proceso de manera recursiva
    await this.processJobs(jobs, this.results);
  }

  async saveJobResult(job, result){
    const newData = {
      completed: true,
      price: result.price,
      provider: result.provider,
      url: result.url,
    };
    const url = process.env.API_URL + '/job/' + job.id;
    console.log('update job', url, newData);
    try {
      return axios.patch(url, newData).then(response => {
        console.log('PATCH RESULT', response.data);
        return response.data;
      });  
    } catch (e){
      console.error('ERROR PATCH', e);
    }
  }
}

module.exports = FetcherApp;