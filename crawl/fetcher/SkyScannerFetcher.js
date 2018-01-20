
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');
const fetcherCommons = require('./commons');
const constants = require('../constants');

module.exports = class SkyScannerFetcher {

  constructor(){
    this.name = constants.PROVIDERS.SKYSCANNER;
  }

  getProviderUrl(origen, destino, startDate, endDate, adults){
    return `https://www.espanol.skyscanner.com/transporte/vuelos/${origen}/${destino}/${startDate.format('YYMMDD')}/${endDate.format('YYMMDD')}?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=true&inboundaltsenabled=true&ref=day-view#results`;
  }

  async process(job) {
    const startDate = moment(job.startDate);
    const endDate = moment(job.endDate);
    const origen = job.owner.origin;
    const destino = job.owner.destination;
    const adults = job.owner.adults;

    return new Promise(async (resolve, reject) => {

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      try {

        const url = this.getProviderUrl(origen, destino, startDate, endDate, adults);
        await page.goto(url);

        await fetcherCommons.waitForElement(page, '#day-section.state-loading-completed');

        // const recomendedPriceEl = await fetcherCommons.waitForElement(page, '#fqs-tabs .tab:nth-child(1) .fqs-price');
        // const recomendedPrice = await fetcherCommons.getInnerText(recomendedPriceEl);
        // const recomendedDurationEl = await fetcherCommons.waitForElement(page, '#fqs-tabs .tab:nth-child(1) .fqs-duration');
        // const recomendedDuration = await fetcherCommons.getInnerText(recomendedDurationEl);
        const bestPriceEl = await fetcherCommons.waitForElement(page, '#fqs-tabs .tab:nth-child(2) .fqs-price');
        const bestPrice = await fetcherCommons.getInnerText(bestPriceEl);
        // const bestDurationEl = await fetcherCommons.waitForElement(page, '#fqs-tabs .tab:nth-child(2) .fqs-duration');
        // const bestDuration = await fetcherCommons.getInnerText(bestDurationEl);

        await browser.close();
        const parsedPrice = parseInt((bestPrice || '').replace(/\D/g, ''));
        resolve({
          price: parsedPrice,
          provider: this.name,
          url,
        });

      } catch (e) {
        await browser.close();
        reject(e);
      }
    });
  }
}