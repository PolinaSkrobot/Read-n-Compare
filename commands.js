const program = require("commander");
const dentalExchange = require("./dentalExchange");
const dentrixWeb = require("./dentrix");
const display = require("./display");
const fs = require("fs");

function filtering(options, arrDental, arrDentrix){
  let resDentrix, resDental
    //filtering by id here
    if (options.id && options.id.length > 0) {
      resDentrix = arrDentrix.filter((obj) => {
        return options.id.includes(obj.payerId);
      });
      resDental = arrDental.filter((obj) => {
        return options.id.includes(obj.payerId);
      });
    } else {
      resDentrix = arrDentrix;
      resDental = arrDental;
    }
    //filtering by name
    if (options.name && options.name.length > 0) {
      if (options.operator === 'and'){
        for (let name of options.name) {
    
          resDentrix = resDentrix.filter((obj) => {
            return obj.name.toLowerCase().includes(name.toLowerCase())
          });
          resDental = resDental.filter((obj) => {
            return obj.name.toLowerCase().includes(name.toLowerCase())
          });
        }
      }
      else if (options.operator === 'or'){ 
      let resNewDentrix=[];
      let resNewDE=[];
      for (let name of options.name) {
        let filtDentrix = resDentrix.filter((obj) => {
          return obj.name.toLowerCase().includes(name.toLowerCase())
        })
        let filtDE = resDental.filter((obj) => {
          return obj.name.toLowerCase().includes(name.toLowerCase())
        });
        resNewDentrix.push(...filtDentrix);
        resNewDE.push(...filtDE);
      }
      resDentrix=resNewDentrix;
      resDental=resNewDE;

      }
    }
    return {resDental, resDentrix}
}

function comparison(prog) {
  const options = prog.opts();
  let dentalFull = [];
  let dentrixFull = [];

  if (options.loadFromWeb) {
    Promise.all([dentalExchange(), dentrixWeb()])
      .then((res) => {
        //return console.log("dentalExchange", res[0], "dentrix", res[1]);
        dentalFull = res[0];
        dentrixFull = res[1];

        const dentalJson = JSON.stringify(dentalFull);
        fs.writeFile("dental.json", dentalJson, "utf8", (err) => {
          if (err) throw err;
        });
        const dentrixJson = JSON.stringify(dentrixFull);
        fs.writeFile("dentrix.json", dentrixJson, "utf8", (err) => {
          if (err) throw err;
        });
      })
      .then(() => {
        filteredData = filtering(options, dentalFull, dentrixFull);
        display(filteredData.resDental, filteredData.resDentrix);
      })
      .finally(()=>{});
  } 
  else {
    if (fs.existsSync("dental.json")) {
      const fileString = fs.readFileSync("dental.json").toString();
      dentalFull = JSON.parse(fileString);
    } else {
      console.log("Data from dentalexchange.com hasn't been load yet. ");
    }
    if (fs.existsSync("dentrix.json")) {
      const fileString2 = fs.readFileSync("dentrix.json").toString();
      dentrixFull = JSON.parse(fileString2);
    } else {
      console.log("Data from dentrix.com hasn't been load yet. ");
    }

    filteredData = filtering(options, dentalFull, dentrixFull);
    display(filteredData.resDental, filteredData.resDentrix);
    
  }
  
}

const listNames = (value, _previous) => {
  if (_previous){
    return value.split(',').concat(_previous);
  }
  else{
    return value.split(',')
  }
  
}

program.version("1.0.0").description("CLI tool to compare payers from dentalExchange.com and dentrix.com");
program
  .option(
    "-i, --id <value...>",
    "Filter by payers id's separated by space. Empty value means no filter. Example: --id 1111 22222"
  )
  .option(
    "-n, --name <value>",
    `Filter by payers name's. Names should be in quotes, separated by comma. Empty value means no filter.
                                  Example: -n 'blue cross, red cross'. By default, separated by comma names are combined with 'and' logic.`,
    listNames
  )
  .option(
    "-o, --operator <value>",
    `Weather separated by comma names are combined with 'and' logic or 'or' logic. Examples: "-o or", "--operator and".`,
    'and'
  )
  .option(
    "-l, --load-from-web",
    "Should be data loaded from web-sites (true) or local cache should be used (false)",
    false
  )
  // .option(
  //   "-m, --match <value...>",
  //   "Match values from the web-cites in the format eClaims=clm attachments=att"
  // )
  // .option("-f, --match-from-file <value...>", "Read match values from a file")
  .action(() => {
    // console.log(id);
    comparison(program);
  });
program.parse(process.argv);