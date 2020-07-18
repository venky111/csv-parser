const { parse } = require('../index');

parse().then((stream) =>
  stream.on('data', (chunk) => console.log(JSON.stringify(chunk)))
);
