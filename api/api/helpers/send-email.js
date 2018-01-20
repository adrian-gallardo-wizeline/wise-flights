const moment = require('moment');
const apiKey = 'key-e3a58856752ceac3308ed06dd61f6984';
const domain = 'sandbox61ee261480244f228c2e29b9a4c15d19.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey, domain });

const dashboardUrl = require('../../config/urls').dashboard;

module.exports = {

  friendlyName: 'Email sender',
  description: 'Sends email?',

  inputs: {
    payload: {
      type: 'json',
      required: true
    }
  },

  fn: async function (inputs, exist) {
    const payload = inputs.payload;
    const { email, code, origin, destination, createdAt, type } = payload;

    const url = dashboardUrl + code;
    const dateSent = moment(createdAt).format('dddd, MMMM Do YYYY');

    const messages = {
      completed: {
        subject: 'Horray 🎉 Your results are ready 👍',
        text: `On ${dateSent} you made a search for fligts from ${origin} to ${destination}.\n\nPlease visit ${url} to see the cheapest flights.\n\nEnjoy your trip. The Wise Flighs team.`,
      },
      notify: {
        subject: 'Wise Flights status update ✈️',
        text: `Please visit this url: ${url} to start monitoring your flights.\n\nRegards. The Wise Flighs team.`,
      }
    };

    const mailOptions = {
      from: 'Wise Flights team <postmaster@sandbox61ee261480244f228c2e29b9a4c15d19.mailgun.org>',
      to: email,
      subject: messages[type].subject,
      text: messages[type].text
    };

    mailgun.messages().send(mailOptions, (err, body) => {
      if (err) {
        return exist.error(err);
      }
      return exist.success(body);
    });
  }

};

