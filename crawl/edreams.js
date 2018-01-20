

const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');

const timeout = 60000;
const origen = 'COR';
const destino = 'GDL';
const fechaIdaDesde = '2018-04-20';
const fechaIdaHasta = '2018-04-30';
const fechaVueltaDesde = '2018-09-27';
const fechaVueltaHasta = '2018-10-08';
const output = 'results.posta2.json';

function obtenerMatrizFechas(idaDesde, idaHasta, vueltaDesde, vueltaHasta) {
  const idaDiff = moment(idaHasta).diff(idaDesde, 'days');
  const vueltaDiff = moment(vueltaHasta).diff(vueltaDesde, 'days');
  const matrizFechas = [];

  for (let i = 0; i <= idaDiff; i++) {
    let fechaIda = moment(idaDesde).add(i, 'days');

    for (let j = 0; j <= vueltaDiff; j++) {
      let fechaVuelta = moment(vueltaDesde).add(j, 'days');

      matrizFechas.push({ ida: fechaIda, vuelta: fechaVuelta });
    }
  }
  return matrizFechas;
}

function init() {
  const matrizFechas = obtenerMatrizFechas(fechaIdaDesde, fechaIdaHasta, fechaVueltaDesde, fechaVueltaHasta);
  const totalFechas = matrizFechas.length;
  const datePrices = [];
  const tInicio = new Date().getTime();

  procesarFechas(matrizFechas, datePrices, totalFechas, function () {
    console.log('RESULTADOS:', totalFechas);
    const results = JSON.stringify(datePrices, null, 4);
    console.log(results);
    fs.writeFile(output, results);
    const tFin = new Date().getTime();
    const minutos = (tFin - tInicio) / 1000 / 60;
    console.log('Total (minutos):', Math.floor(minutos));
    console.log('FIN');
  });
}
init();

function procesarFechas(matrizFechas, datePrices, totalFechas, done) {
  const fechas = matrizFechas[0];

  console.log('Procesando:', (totalFechas - matrizFechas.length + 1), '/', totalFechas)

  obtenerPrecios(fechas.ida, fechas.vuelta).then(prices => {
    storePrice(datePrices, fechas.ida, fechas.vuelta, prices);

    matrizFechas.splice(0, 1);

    if (matrizFechas.length > 0) {
      procesarFechas(matrizFechas, datePrices, totalFechas, done)
    } else {
      done();
    }
  }, error => {
    console.error(fechas.ida.format('DD/MM/YYYY'), '-', fechas.vuelta.format('DD/MM/YYYY'), ':', error);
    procesarFechas(matrizFechas, datePrices, totalFechas, done);
  });
}


function obtenerPrecios(fechaIda, fechaVuelta) {
  return new Promise(async (resolve, reject) => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {

      console.log(fechaIdaDesde, '/', origen);
                  
      const url = `https://www.edreams.com/#/results/type=R;dep=${fechaIdaDesde};from=${origen};to=${destino};ret=${fechaVueltaHasta};collectionmethod=false;airlinescodes=false;internalSearch=true`;
  
      await page.goto(url);
      await waitForElement(page, '.price_label');
      const recomendedPriceEl = await waitForElement(page, '.od-price-container .od-resultpage-price-text-int');
      const recomendedPrice = await getInnerText(recomendedPriceEl);
      const recomendedDurationEl = await waitForElement(page, '.od-primary-flight-info-duration .odf-text-nowrap');
      const recomendedDuration = await getInnerText(recomendedDurationEl);
      const bestPriceEl = await waitForElement(page, '.od-price-container .od-resultpage-price-text-int');
      const bestPrice = await getInnerText(bestPriceEl);
      const bestDurationEl = await waitForElement(page, '.od-primary-flight-info-duration .odf-text-nowrap');
      const bestDuration = await getInnerText(bestDurationEl);

      const prices = {
        recomended: [recomendedPrice, recomendedDuration],
        best: [bestPrice, bestDuration],
      };
      console.log(prices);
      await browser.close();
      resolve(prices);

    } catch (e) {
      await browser.close();
      reject('Error', e);
    }
  });
}

function storePrice(datePrices, fechaIda, fechaVuelta, prices) {
  datePrices.push({
    ida: fechaIda.format('YYYY-MM-DD'),
    vuelta: fechaVuelta.format('YYYY-MM-DD'),
    recomended: prices.recomended[0],
    recomendedDuration: prices.recomended[1],
    best: prices.best[0],
    bestDuration: prices.best[1]
  });
}

async function waitForElement(page, selector, timeout = 60000) {
  return new Promise((resolve, reject) => {
    var i = setInterval(async () => {
      timeout -= 100;
      var el = await page.$(selector);
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