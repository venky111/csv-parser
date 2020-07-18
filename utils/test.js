const { parse } = require('../index');

parse.on('data', (chunk) =>
  console.log('not from here', JSON.stringify(chunk))
);

console.log('Thank God!!! Its working', x);
