var express = require('express');
var axios = require('axios');
var app = express();

require('dotenv').config()

app.get('/awake', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
  init();
  console.log('Example app listening on port 3000!');
});

async function init() {
  const jobs = await getJobs();

  console.log(jobs);
}

async function getJobs() {
  return axios.get(process.env.API_URL + '/query', {
    params: {
      completed: false
    }
  });
}