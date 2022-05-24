function display(dental, dentrix) {
  if (dentrix.length > 0) {
    dentrix.map(function (x) {
      let obj = {};
      obj = Object.keys(x).forEach((el) => {
        if (x[el] === "glyphicon glyphicon-check") {
          x[el] = "+";
        } else if (x[el] === "glyphicon glyphicon-unchecked") {
          x[el] = "-";
        }
      });
    });
  }

  for (let payer of dentrix) {
    if (payer.name.length<100){
      placeholder = ' '.repeat(100-payer.name.length)
      payer.name = payer.name+placeholder;
    }
  }

  console.log("dentrix.com")
  console.table(dentrix);

  //-----------dentalExchange
  if (dental.length > 0) {
    dental.map(function (x) {
      let obj = {};
      obj = Object.keys(x).forEach((el) => {
        if (x[el] === "fa fa-check") {
          x[el] = "+";
        } else if (x[el] === "") {
          x[el] = "-";
        }
      });
    });
  }
 
  const structDatasDentalExchange = dental.map((e) => ({
    //convert each element to obj for futher search purposes
    payerId: e["payerId"],
    name: e["name"],
    eClaims: e["clm"],
    SpecialEnrollment: "n/a",
    attachments: e["att"],
    eligibility: e["eli"],
    realTime: e["rtc"],
    eEOB: e["era"],
    eEOBEnrollment: "n/a",
    ben: e["ben"],
    sta: e["sta"]
  }));

  for (let payer of structDatasDentalExchange) {
    if (payer.name.length<100){
      placeholder = ' '.repeat(100-payer.name.length)
      payer.name = payer.name+placeholder;
  }
}

  console.log("")
  console.log("DentalExchange.com")
  console.table(structDatasDentalExchange);
}

module.exports = display;
