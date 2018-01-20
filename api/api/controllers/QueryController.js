const moment = require('moment');

const DATE_FORMAT = 'YYYY-MM-DD';

function* generateIntervals(payload) {
  const { fromDate, toDate, minDays, maxDays } = payload;

  const startDate = moment(fromDate);
  const endDate = moment(toDate);

  for (let diff = minDays; diff <= maxDays; diff++) {
    const left = startDate.clone();

    while (left.isSameOrBefore(endDate)) {

      const right = left.clone();
      right.add(diff, 'days');

      yield {
        startDate: left.format(DATE_FORMAT),
        endDate: right.format(DATE_FORMAT)
      };

      left.add(1, 'days');
    }
  }
}


const actions = {

  create(req, res) {
    const payload = req.body;
    const intervals = generateIntervals(payload);

    for (let interval of intervals) {
    }
  }

};

module.exports = actions;
