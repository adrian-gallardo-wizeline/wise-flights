const uuid = require('uuid/v4');
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

  async create(req, res) {
    const payload = req.body;

    payload.code = uuid();

    try {
      const { id: owner } = await Query.create(payload).fetch();
      const intervals = generateIntervals(payload);

      const jobs = [];

      for (let interval of intervals) {
        const data = Object.assign(interval, { owner });
        jobs.push(await Job.create(data));
      }

      await Promise.all(jobs);

      // Notify scrapper

      return res.json({
        code: payload.code,
        totalJobs: jobs.length
      });

    } catch (err) {
      return res.serverError(err);
    }
  }

};

module.exports = actions;
