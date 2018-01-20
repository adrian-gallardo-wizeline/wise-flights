/**
 * Query.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {

    code: { type: 'string', unique: true, required: true },
    adults: { type: 'number' },
    email: { type: 'string' },
    origin: { type: 'string' },
    destination: { type: 'string' },
    fromDate: { type: 'string' },
    toDate: { type: 'string' },
    minDays: { type: 'number' },
    maxDays: { type: 'number' },

    createdAt: { type: 'number', autoCreatedAt: true },

    totalJobs: { type: 'number' },
    completedJobs: { type: 'number', defaultsTo: 0 },

    jobs: { collection: 'job', via: 'owner' },
  }
};
