
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');
const fetcherCommons = require('./commons');
const constants = require('../constants');

module.exports = class EDreamsFetcher {

  constructor() {
    this.name = constants.PROVIDERS.EDREAMS;
  }

  getProviderUrl(origen, destino, startDate, endDate, adults) {
    return `https://www.edreams.com.mx/?#/results/type=R;dep=${startDate};from=${origen};to=${destino};ret=${endDate};collectionmethod=false;airlinescodes=false;internalSearch=true`
  }

  async process(job) {
    const startDate = moment(job.startDate).format('YYYY-MM-DD');
    const endDate = moment(job.endDate).format('YYYY-MM-DD');
    const origen = job.owner.origin;
    const destino = job.owner.destination;
    const adults = job.owner.adults;

    return new Promise(async (resolve, reject) => {

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      try {

        const url = this.getProviderUrl(origen, destino, startDate, endDate, adults);
        await page.goto(url);

        await fetcherCommons.waitForElement(page, '.price_label');

        // const recomendedPriceEl = await fetcherCommons.waitForElement(page, '.od-price-container .od-resultpage-price-text-int');
        // const recomendedPrice = await fetcherCommons.getInnerText(recomendedPriceEl);
        // const recomendedDurationEl = await fetcherCommons.waitForElement(page, '.od-primary-flight-info-duration .odf-text-nowrap');
        // const recomendedDuration = await fetcherCommons.getInnerText(recomendedDurationEl);
        const bestPriceEl = await fetcherCommons.waitForElement(page, '.od-price-container .od-resultpage-price-text-int');
        const bestPrice = await fetcherCommons.getInnerText(bestPriceEl);
        // const bestDurationEl = await fetcherCommons.waitForElement(page, '.od-primary-flight-info-duration .odf-text-nowrap');
        // const bestDuration = await fetcherCommons.getInnerText(bestDurationEl);

        await browser.close();
        const parsedPrice = parseInt((bestPrice || '').replace(/\D/g, ''));
        resolve({
          price: parsedPrice,
          provider: this.name,
          link: 'edreams.com',
        });

      } catch (e) {
        await browser.close();
        reject(e);
      }
    });
  }
}