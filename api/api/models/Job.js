/**
 * Job.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {

    startDate: { type: 'string' },
    endDate: { type: 'string' },
    completed: { type: 'boolean', defaultsTo: false },
    attempts: { type: 'number', defaultsTo: 0 },

    url: { type: 'string', allowNull: true },
    price: { type: 'number', allowNull: true },
    provider: { type: 'string', allowNull: true },

    owner: { model: 'query' },
  }
};

