const { CSV } = require('../../index');
const fs = require('fs');

const result = CSV.toJSON('../testdata/sample.csv', {
  header: false,
  isRemoteUrl: false,
  isData: false,
  separator: ',',
  destination: '../testdata/output.txt',
  transformHeader: (header) => header.toUpperCase(),
});

if (result instanceof Error) console.log(result.message);
//else result.pipe(process.stdout);
//else result.on('data', (chunk) => console.log(chunk));

// csv string is faster than reading csv from file

CSV.toJSON(
  'key1;key2;key3\naaa ;  bbb ; ccc\rxxx; yyy  ;zzz\r\n aaa ;  bbb ; ccc\nxxx; yyy  ;zzz ',
  {
    header: true,
    isRemoteUrl: false,
    isData: true,
    separator: ';', //     customHeader: ['customHeader1', 'customHeader2', 'customHeader3'],
  }
)
  .on('data', (chunk) => console.log(chunk))
  .on('error', (err) => {
    console.log(err.message);
  });
