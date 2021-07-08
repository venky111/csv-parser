const fs = require("fs");
const { Readable } = require("stream");
const path = require("path");

const reader = fs.createReadStream("./sample.csv", {
  encoding: "utf8",
});

const jsonData = [];

/**
 * The function will parse one chunk of csv string to corresponding JSON.
 * @param {string} chunk Current csv string to be processed
 * @param {string} header Header for the current csv strings(Work as keys)
 */
function parseCSVChunk(chunk, header) {
  // Remove line feeds from chunk.
  let lines = chunk.split(/\r|\n|\r\n|\r?\n/g);
  // check for valid line.
  lines = lines.filter((ele) => /\S/.test(ele));
  // Create key value pair if header is valid
  if (header) {
    const keys = lines.shift();
    generateJSON(lines, keys.split(","));
  } else generateJSON(lines); // Else simply create json without keys.
}

/**
 * Generate JSON from objects and keys.
 * @param {Array.<string>} lines Array of JSON Objects.
 * @param {Array.<string>} keys Array of JSON keys.
 */
function generateJSON(lines, keys) {
  let i = 0;
  for (const line of lines) {
    const stringArray = line.split(",");
    let object = new Object();
    i = 0;
    for (const str of stringArray) {
      if (keys !== undefined && keys.length > 0) {
        Object.defineProperty(object, keys[i++], {
          value: str,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        object = stringArray;
      }
    }
    jsonData.push(object);
  }
}

/**
 * Class to read csv as stream and parse it.
 */
class CreateObjectStream extends Readable {
  constructor(readableStreamArray) {
    super({ objectMode: true });
    this.readableStreamArray = readableStreamArray;
    this.index = 0;
  }

  /**
   * overiding read method of Readable class.
   */
  _read() {
    if (this.index < this.readableStreamArray.length) {
      this.push(this.readableStreamArray[this.index++]);
    } else {
      this.push(null);
    }
  }
}

/**
 * Parse the Readable stream asynchronously.
 */
const parse = async () => {
  let header = false;
  for await (const chunk of reader) {
    parseCSVChunk(chunk, header);
    header = false;
  }
  return new CreateObjectStream(jsonData);
};

module.exports.parse = parse;
