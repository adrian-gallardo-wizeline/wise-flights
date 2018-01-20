const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

const FetcherApp = require('./fetcher/FetcherApp');

app.get('/awake', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
  init();
  console.log('Example app listening on port 3000!');
});

async function init() {
  const jobs = await getJobs();
  const fetcherApp = new FetcherApp();

  await fetcherApp.processJobs(jobs);

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