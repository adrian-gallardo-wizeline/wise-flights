const actions = {
  async update(req, res) {
    const { id: jobId } = req.params;
    const completed = req.body.completed === 'true';

    try {
      const [{ owner }] = await Job.update({ id: jobId })
        .set({ completed })
        .fetch();

      const current = await Query.findOne({ id: owner });

      const [{ completedJobs, totalJobs }] = await Query.update({ id: current.id })
        .set({ completedJobs: current.completedJobs + 1 })
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
