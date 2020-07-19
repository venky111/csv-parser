const { parse } = require("../index");
const JSONParser = require("../json2csv");

// parse("./sample.csv", {
//   header: false,
//   isRemoteUrl: false,
//   isData: false,
//   separator: ",",
// }).on("data", (chunk) => console.log(JSON.stringify(chunk)));

// csv string is faster than reading csv from file

// parse(
//   'key1,key2,key3\naaa ,  bbb , ccc\r¬xxx, yyy  ,zzz\r\n ¬aaa ,  bbb , ccc¬\nxxx, yyy  ,zzz ¬',
//   {
//     header: true,
//     isRemoteUrl: false,
//     isData: true,
//     separator: ',',
//   }
// ).on('data', (chunk) => console.log(JSON.stringify(chunk)));

const jsonParser = new JSONParser("./test.json", {
  is_file: true,
  delimeter: ":",
});
jsonParser.on("data", (chunk) => {
  console.log("this", chunk);
});
