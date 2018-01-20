/**
 * Query.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: 'number', autoIncrement: true },
    createdAt: { type: 'number', autoCreatedAt: true },
    code: { type: 'string' },
    adults: { type: 'number' },
    email: { type: 'string' },
    origin: { type: 'string' },
    destination: { type: 'string' },
    totalJobs: { type: 'number' },
    completedJobs: { type: 'number', defaultsTo: 0 },
  }
};
