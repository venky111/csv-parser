# csv-parser

A CSVparser to parse the input csv file or string into JSON and vice versa

## API

CSV

## Methods

### toJSON
### parse

## Parameters

### toJSON

 **filePath**
 - Its a string takes data/CSV data file path.

**header**
 - Its a boolean to represent whether first line should be taken for keys.
 - Default value : false

**isRemoteUrl**
 - Its a boolean to to represent if filepath passed is remote.
 - Default value : false

**isData**
 - Its a boolean to represent if value passed in filepath is data or filepath
 - Default value : false

**separator**
 - Its string takes the separator used in csv to separate data
 - Default value : ','

**destination**
 - It takes destination/output file path.

**transformHeader**
 - takes array of keys/function to transform header in input

## Example 1:

```const { CSV } = require('csv');
const fs = require('fs');

const result = CSV.toJSON('../testdata/sample.csv', {
header: false,
isRemoteUrl: false,
isData: false,
separator: ',',
destination: '../testdata/output.txt',
transformHeader: (header) => header.toUpperCase(),
});

result.pipe(process.stdout);```


## Example 2:

```const { CSV } = require('csv');
const fs = require('fs');

CSV.toJSON(
'key1;key2;key3\naaa ; bbb ; ccc\rxxx; yyy ;zzz\r\n aaa ; bbb ; ccc\nxxx; yyy ;zzz ',
{
header: true,
isRemoteUrl: false,
isData: true,
separator: ';', // customHeader: ['customHeader1', 'customHeader2', 'customHeader3'],
}
)
.on('data', (chunk) => console.log(chunk))
.on('error', (err) => {
console.log(err.message);
});```
