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

// new JSONParser("./test.json", {
//   is_file: true,
//   delimeter: "\t",
// }).on("data", (chunk) => {
//   console.log(chunk);
// });

new JSONParser(
  `[
  {
    "name": "Prashant Singh",
    "phone": "1234",
    "address": {
      "line1": "whatever",
      "line2": "again",
      "meri": {
        "key": "key"
      }
    }
  },
  {
    "name": "Sonu Tiwari",
    "phone": "1234"
  }
]`,
  {
    is_file: false,
    delimeter: "\t",
  }
).on("data", (chunk) => {
  console.log(chunk);
});
