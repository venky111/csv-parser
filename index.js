const { csvparser } = require('./parser/csvparser');
//const { jsonparser } = require('./parser/jsontocsv');

module.exports.CSV = {
  toJSON: csvparser,
  // parse: jsonparser,
};
