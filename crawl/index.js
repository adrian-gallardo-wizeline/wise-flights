var express = require('express');
var app = express();

app.get('/awake', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  init();
  console.log('Example app listening on port 3000!');
});

function init(){
  const jobs = await getJobs();
  console.log(jobs);
}

async function getJobs(){
  axios.get(process.env.API_URL + '/job', {
    params: {
      completed: false
    }
  });
}