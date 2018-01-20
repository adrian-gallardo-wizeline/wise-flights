const uuid = require('uuid/v4');
const moment = require('moment');
const axios = require('axios');
const workerUrl = require('../../config/urls').worker;

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
      const query = await Query.create(payload).fetch();
      const { id, createdAt } = query;
      const intervals = generateIntervals(payload);

      const jobs = [];

      for (let interval of intervals) {
        const data = Object.assign(interval, { owner: id });
        jobs.push(await Job.create(data).fetch());
      }

      // Wait for all jobs to be created
      await Promise.all(jobs);

      // Update total jobs for the current query
      await Query.update({ id })
        .set({ totalJobs: jobs.length });

      res.json({
        code: payload.code,
        totalJobs: jobs.length,
      });

      // Notify worker of new jobs
      axios.post(workerUrl, { jobs, query });

      // Send notify email
      const emailConfig = Object.assign(payload, { createdAt, type: 'notify' });
      await sails.helpers.sendEmail(emailConfig);

    } catch (err) {
      return res.serverError(err);
    }
  }

};

module.exports = actions;
