# csv-parser

A CSVparser to parse the input csv file or string into JSON and vice versa

# 1. CSV PARSER

<p>Take CSV file or CSV string and parse it to corresponding JSON.</p>

## Options Available

'''
{
header ===> default values is true,
isRemoteUrl ====> default value is false,
isData ====> default value is true,
separator ====> default value is ,
}
'''

## 1.1 CSV file

### Sample run

`parse("./sample.csv", { header: false, isRemoteUrl: false, isData: false, separator: ",", }).on("data", (chunk) => console.log(JSON.stringify(chunk)));`

## 1.2 CSV String

### Sample run

`parse( 'key1,key2,key3\naaa , bbb , ccc\r¬xxx, yyy ,zzz\r\n ¬aaa , bbb , ccc¬\nxxx, yyy ,zzz ¬', { header: true, isRemoteUrl: false, isData: true, separator: ',', } ).on('data', (chunk) => console.log(JSON.stringify(chunk)));`

# 2. JSON PARSER

<p>Take JSON File or JSON String and parse it to corresponding CSV file.</p>

## Options available

{
encoding ==> default encoding is "utf-8",
is_file ===> default value is false,
delimeter ===> default vslue is ,
}

## 2.1 JSON File

### Sample use

new JSONParser("./test.json", {
is_file: true,
delimeter: "\t",
}).on("data", (chunk) => {
console.log(chunk);
});

## 2.2 JSON String

### Sample use

new JSONParser(
`[ { "name": "Prashant Singh", "phone": "1234", "address": { "line1": "whatever", "line2": "again", "meri": { "key": "key" } } }, { "name": "Sonu Tiwari", "phone": "1234" } ]`,
{
is_file: false,
delimeter: "\t",
}
).on("data", (chunk) => {
console.log(chunk);
});
