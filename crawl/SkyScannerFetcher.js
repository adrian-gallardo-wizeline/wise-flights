
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');

module.exports = class SkyScannerFetcher {

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

        await waitForElement(page, '#day-section.state-loading-completed');

        const bestPriceEl = await waitForElement(page, '#fqs-tabs .tab:nth-child(2) .fqs-price');
        const bestPrice = await getInnerText(bestPriceEl);
        const bestDurationEl = await waitForElement(page, '#fqs-tabs .tab:nth-child(2) .fqs-duration');
        const bestDuration = await getInnerText(bestDurationEl);

        await browser.close();
        const parsedPrice = parseInt((bestPrice || '').replace(/\D/g, ''));
        resolve(parsedPrice);

      } catch (e) {
        await browser.close();
        reject(e);
      }
    });
  }
}

async function waitForElement(page, selector, timeout = 30000) {
  return new Promise((resolve, reject) => {
    var i = setInterval(async () => {
      timeout -= 100;
      let el;
      try {
        el = await page.$(selector);
      } catch (e){ }
      
      if (el) {
        clearInterval(i);
        resolve(el);
      } else if (timeout <= 0) {
        clearInterval(i);
        reject(null);
      }
    }, 100);
  });
}

async function getInnerText(elHandle) {
  return (await elHandle.getProperty('innerHTML')).jsonValue()
}