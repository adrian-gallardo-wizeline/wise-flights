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

const testJobs = [
  {
    "createdAt": 1516423568921,
    "updatedAt": 1516479688569,
    "id": 1,
    "startDate": "2018-02-01",
    "endDate": "2018-02-10",
    "completed": true,
    "attempts": 0,
    "url": "https://www.espanol.skyscanner.com/transporte/vuelos/COR/BUE/180201/180210?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=true&inboundaltsenabled=true&ref=day-view#results",
    "price": 3559,
    "provider": "SKYSCANNER",
    "owner": {
      "createdAt": 1516423217892,
      "updatedAt": 1516479702216,
      "id": 1,
      "code": "",
      "adults": 1,
      "email": "agallardo@wizeline.com",
      "origin": "COR",
      "destination": "BUE",
      "fromDate": "",
      "toDate": "",
      "minDays": 0,
      "maxDays": 0,
      "totalJobs": 0,
      "completedJobs": 56
    }
  },
  {
    "createdAt": 1516469639684,
    "updatedAt": 1516479702213,
    "id": 2,
    "startDate": "2018-02-02",
    "endDate": "2018-02-10",
    "completed": true,
    "attempts": 0,
    "url": "https://www.espanol.skyscanner.com/transporte/vuelos/COR/BUE/180202/180210?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=true&inboundaltsenabled=true&ref=day-view#results",
    "price": 3559,
    "provider": "SKYSCANNER",
    "owner": {
      "createdAt": 1516423217892,
      "updatedAt": 1516479702216,
      "id": 1,
      "code": "",
      "adults": 1,
      "email": "agallardo@wizeline.com",
      "origin": "COR",
      "destination": "BUE",
      "fromDate": "",
      "toDate": "",
      "minDays": 0,
      "maxDays": 0,
      "totalJobs": 0,
      "completedJobs": 56
    }
  }
];


app.post('/newJobs', function (req, res) {

  const query = req.body.query || {};
  const jobs = req.body.jobs || [];
  
  // const jobs = testJobs.concat();
  console.log('-- INCOMING NEW JOBS --', jobs.length);  

  jobs.forEach(job => {
    job.owner = query;
  });

  console.log('query', query);
  console.log('jobs', jobs);
  
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
  // JOBS.push(...newJobs);
  // await fetcherApp.processJobs(JOBS);
  await fetcherApp.processJobs(newJobs);
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