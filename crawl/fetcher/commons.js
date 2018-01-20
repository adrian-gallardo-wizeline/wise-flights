async function waitForElement(page, selector, timeout = 30000) {
  return new Promise((resolve, reject) => {
    var i = setInterval(async () => {
      timeout -= 100;
      let el;
      try {
        el = await page.$(selector);
      } catch (e) { }

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

module.exports = {
  waitForElement,
  getInnerText,
}