const actions = {
  async update(req, res) {
    const { id } = req.params;
    console.log('body', req.body)
    try {
      const [{ owner }] = await Job.update({ id })
        .set(req.body)
        .fetch();

      const query = await Query.findOne({ id: owner });

      const [{ completedJobs, totalJobs }] = await Query.update({ id: query.id })
        .set({ completedJobs: query.completedJobs + 1 })
        .fetch();

      if (completedJobs === totalJobs) {
        const emailConfig = Object.assign(query, { type: 'completed' });
        await sails.helpers.sendEmail(emailConfig);
      }

      return res.sendStatus(200);

    } catch (err) {
      res.serverError(err);
    }
  }
};

module.exports = actions;
