const puppeteer = require("puppeteer");

module.exports = async () => {
  const browser = await puppeteer.launch();
  const pageDentalExchange = await browser.newPage();
  await pageDentalExchange
    .goto("https://www.dentalxchange.com/provider/PayerList?0")
    .catch((er) => console.log(er));
  const arrDExchange = [];
  let available = false; //prevent site's maintenance error
  await pageDentalExchange
    .waitForSelector("tbody", { timeout: 1000 })
    .then(() => (available = true))
    .catch((e) => (available = false));
  if (available) {
    async function getDataDExch() {
      const result = await pageDentalExchange.$$eval(".even", (rows) => {
        return Array.from(rows, (row) => {
          const columns = row.querySelectorAll("span");
          return Array.from(
            columns,
            (column) => column.innerText || column.className
          );
        });
      });
      const resultOdd = await pageDentalExchange.$$eval(".odd", (rows) => {
        return Array.from(rows, (row) => {
          const columns = row.querySelectorAll("span");
          return Array.from(
            columns,
            (column) => column.innerText || column.className
          );
        });
      });

      return arrDExchange.push(...result, ...resultOdd);
    }

    async function amount() {
      //reading footer for while loop
      const amount1 = await pageDentalExchange.$$eval("tfoot", (rows) => {
        return Array.from(rows, (row) => {
          const columns = row.querySelector(".navigatorLabel");
          return columns.innerText;
        });
      });

      return amount1[0].split(" ");//to grab total amount of payers
    }
    let foot = await amount();
    let footMax = Number(foot[5]);//total amount of payers
    let footActual = 0;
    while (footActual < footMax) {
      await getDataDExch();
      await pageDentalExchange.$eval(".fa-chevron-right", (el) => el.click()); // click link to cause navigation
      await new Promise((r) => setTimeout(r, 200));//ugly method to wait until it goes to next page
      footActual += 25;
    }
    const listDentalExchange = arrDExchange.map((e) => ({
      payerId: e[0],
      name: e[1],
      clm: e[2],
      eli: e[3],
      ben: e[4],
      sta: e[5],
      era: e[6],
      rtc: e[7],
      att: e[8],
    }));

    await browser.close();

    return listDentalExchange;
  } else {
    await browser.close();
    return [
      {
        payerId: "23210",
        name: "BeneCare Dental Plan",
        clm: "fa fa-check",
        eli: "",
        ben: "",
        sta: "",
        era: "",
        rtc: "",
        att: "",
      },
    ];
  }
};
