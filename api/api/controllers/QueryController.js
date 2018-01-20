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
      const { id, createdAt } = await Query.create(payload).fetch();
      const intervals = generateIntervals(payload);

      const jobs = [];

      for (let interval of intervals) {
        const data = Object.assign(interval, { owner: id });
        jobs.push(await Job.create(data));
      }

      await Promise.all(jobs);

      await Query.update({ id })
        .set({ totalJobs: jobs.length });

      // notify scrapper

      const emailConfig = Object.assign(payload, { createdAt, type: 'notify' });

      res.json({
        code: payload.code,
        totalJobs: jobs.length,
      });

      await sails.helpers.sendEmail(emailConfig);

    } catch (err) {
      return res.serverError(err);
    }
  }

};

module.exports = actions;
