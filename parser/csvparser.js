const fs = require('fs');
const { Readable, Transform } = require('stream');
const http = require('http');

function parse(dataOrFilePath, options) {
  if (
    dataOrFilePath === undefined ||
    typeof dataOrFilePath !== 'string' ||
    dataOrFilePath === null
  )
    return new Error(
      'Expected file name of type string but got ',
      typeof dataOrFilePath
    );
  const { isData = false, isRemoteUrl = false, destination } = options;
  let reader;
  if (isData) {
    reader = Readable.from(dataOrFilePath);
  } else {
    if (isRemoteUrl) {
      http
        .get(dataOrFilePath, (res) => (reader = res))
        .on('error', function () {
          return new Error('GET request error');
        });
    } else {
      if (!fs.existsSync(dataOrFilePath)) return new Error('No file found.');
      reader = fs.createReadStream(dataOrFilePath, { encoding: 'utf8' });
    }
  }
  if (destination) {
    const writer = fs.createWriteStream(destination);
    reader.pipe(new CreateObjectStream(options)).pipe(writer);
    return true;
  } else return reader.pipe(new CreateObjectStream(options));
}

/**
 * Class to read csv as stream and parse it.
 */
class CreateObjectStream extends Transform {
  constructor(options) {
    super({ objectMode: true });
    this.options = options;
    let { header } = options;
    this.header = header;
  }

  /**
   * overiding tranform method of Transform class.
   */
  _transform(chunk, encoding, cb) {
    let chunkJsonData;
    let keys;
    if (this.header) {
      const { transformHeader, separator } = this.options;
      const keysAndChunk = getHeader(chunk);
      keys = keysAndChunk[0];
      chunk = keysAndChunk[1];
      if (keys) keys = keys.split(separator);
      if (typeof transformHeader === 'function') {
        keys = keys.map((key) => transformHeader(key));
      } else if (Array.isArray(transformHeader)) {
        keys = transformHeader;
      }
      this.header = false;
    }
    chunkJsonData = parseCSVChunk(chunk, keys, this.options);
    //console.log(chunkJsonData);
    if (chunkJsonData instanceof Error) {
      this.push(JSON.stringify(chunkJsonData.message));
    } else {
      this.push(JSON.stringify(chunkJsonData));
    }
    cb();
  }
}

function getHeader(chunk) {
  // Remove line feeds from chunk.
  let lines = chunk.split(/\r|\n|\r\n/g);
  // check for valid line.
  lines = lines.filter((ele) => /\S/.test(ele));
  // Create key value pair if header is valid
  let keys = lines.shift();
  if (keys.trim() === '' || typeof keys !== 'string')
    return new Error(`Expected header line of string type, got ${typeof line}`);
  else return [keys, lines.join('\n')];
}

/**
 * The function will parse one chunk of csv string to corresponding JSON.
 * @param {string} chunk Current csv string to be processed
 * @param {string} header Header for the current csv strings(Work as keys)
 */
function parseCSVChunk(chunk, keys, options) {
  //read the separator
  const { separator = ',' } = options;

  // Remove line feeds from chunk.
  let lines = chunk.split(/\r|\n|\r\n/g);

  // check for valid line.
  lines = lines.filter((ele) => /\S/.test(ele));

  return generateJSON(lines, separator, keys);
}

/**
 * Generate JSON from objects and keys.
 * @param {Array.<string>} lines Array of JSON Objects.
 * @param {Array.<string>} keys Array of JSON keys.
 */
function generateJSON(lines, separator, keys) {
  let jsonObject = [];
  for (const line of lines) {
    const stringArray = line.split(separator);
    let obj = new Object();
    let i = 0;
    if (keys !== undefined) {
      if (keys.length !== stringArray.length)
        return new Error(
          `no of Keys in header are not equal to values in a line`
        );
      for (const str of stringArray) {
        obj[keys[i++]] = str;
      }
    } else {
      obj = stringArray;
    }
    jsonObject.push(obj);
  }
  return jsonObject;
}

module.exports.csvparser = parse;
