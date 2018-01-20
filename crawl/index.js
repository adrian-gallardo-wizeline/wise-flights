const express = require('express');
const axios = require('axios');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();

const FetcherApp = require('./fetcher/FetcherApp');

const fetcherApp = new FetcherApp();
const JOBS = [];


app.get('/newJobs', function (req, res) {
  const jobs = req.body || [];
  console.log('-- INCOMING NEW JOBS --', jobs.length);  
  res.sendStatus(200);
  processJobs(jobs);
});

app.listen(process.env.PORT, function () {
  console.log(`Listening on port ${process.env.PORT}!`);
  init();
});

async function init() {
  const jobs = await getJobs();
  processJobs(jobs);
}

async function processJobs(newJobs){
  JOBS.push(...newJobs);
  await fetcherApp.processJobs(JOBS);
  console.log('done', fetcherApp.getResults());
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