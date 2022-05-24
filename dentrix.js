const puppeteer = require("puppeteer");

module.exports = async () => {
  const browser = await puppeteer.launch();
  const pageDentrix = await browser.newPage();
  await pageDentrix
    .goto(
      "https://www.dentrix.com/products/eservices/eclaims/payor-search?start=0"
    )
    .catch((err) => console.log(err));
  const arrDentrix = [];
  let available = false; //prevent err if website maintenance
  await pageDentrix
    .waitForSelector("tbody", { timeout: 1000 }) //waiting for table
    .then(() => (available = true))
    .catch((e) => (available = false));

  if (available) {
    async function getDataDentrix() {
      const result = await pageDentrix.$$eval("#payorResults tr", (rows) => {
        return Array.from(rows, (row) => {
          const columns = row.querySelectorAll("td");
          return Array.from(
            columns,
            (column) => column.innerText || column.querySelector("i").className
          );
        });
      });
      result.shift(); //get rid of columns name
      return arrDentrix.push(...result);
    }
    await getDataDentrix(); //get first page of table

    let isVisibleButtonNext = true;
    while (isVisibleButtonNext) {
      const button = await pageDentrix.$x("//a[contains(text(), '>')]"); //catch next button
      if (button.length > 0) {
        await button[0].click();
        await pageDentrix.waitForNavigation();
        await getDataDentrix(); //get data from new page
      } else {
        isVisibleButtonNext = false;
      }
    }

    const listDentrix = arrDentrix.map((e) => ({
      //convert each element to obj for futher search purposes
      payerId: e[0],
      name: e[1],
      eClaims: e[2],
      specialEnrollment: e[3],
      attachments: e[4],
      eligibility: e[5],
      realTime: e[6],
      eEOB: e[7],
      eEOBEnrollment: e[8],
    }));
    await browser.close();
    return listDentrix;
  
  } else {
    await browser.close();
    return [//for test purposes (should return message that table is not available at the moment)
      {
        payerId: "23210",
        name: "BeneCare Dental Plans",
        eClaims: "glyphicon glyphicon-check",
        specialEnrollment: "glyphicon glyphicon-unchecked",
        attachments: "glyphicon glyphicon-unchecked",
        eligibility: "glyphicon glyphicon-unchecked",
        realTime: "glyphicon glyphicon-unchecked",
        eEOB: "glyphicon glyphicon-unchecked",
        eEOBEnrollment: "glyphicon glyphicon-unchecked",
      },
    ];
  }
};