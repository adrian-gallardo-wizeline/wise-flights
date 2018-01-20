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
        // mail notification & realtime sync
      }

      return res.ok();

    } catch (err) {
      res.serverError(err);
    }
  }
};

module.exports = actions;
