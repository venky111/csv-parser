const { CSV } = require('../../index');
const fs = require('fs');

//1st test case
const result = CSV.toJSON('../testdata/sample.csv', {
  header: false,
  isRemoteUrl: false,
  isData: false,
  separator: ',',
  transformHeader: (header) => header.toUpperCase(),
});

if (result instanceof Error) console.log(result.message);
else result.pipe(process.stdout);
//else result.on('data', (chunk) => console.log(chunk));

//2nd test case
const result1 = CSV.toJSON('../testdata/sample.csv', {
  header: true,
  isRemoteUrl: false,
  isData: false,
  separator: ',',
  destination: '../testdata/output.json',
  transformHeader: (header) => header.toUpperCase(),
});

//3rd test case , custom separator,header
CSV.toJSON(
  'key1;key2;key3\naaa ;  bbb ; ccc\rxxx; yyy  ;zzz\r\n aaa ;  bbb ; ccc\nxxx; yyy  ;zzz ',
  {
    header: true,
    isRemoteUrl: false,
    isData: true,
    separator: ';', //
    transformHeader: ['customHeader1', 'customHeader2', 'customHeader3'],
  }
)
  .on('data', (chunk) => console.log(chunk))
  .on('error', (err) => {
    console.log(err.message);
  });
