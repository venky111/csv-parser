const fs = require('fs');
const { Readable } = require('stream');

const reader = fs.createReadStream('./sample.csv', {
  encoding: 'utf8',
});

const JsonData = [];

function parseCSVChunk(chunk, header) {
  let lines = chunk.split(/\r|\n|\r\n/g);
  lines = lines.filter((ele) => {
    return /\S/.test(ele);
  });
  if (header) {
    const keys = lines.shift();
    generateJSON(lines, keys.split(','));
  } else generateJSON(lines);
}

function generateJSON(lines, keys) {
  let i = 0;
  for (const line of lines) {
    const stringArray = line.split(',');
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
    JsonData.push(object);
  }
}

class createObjectStream extends Readable {
  constructor(Array) {
    super({ objectMode: true });
    this.Array = Array;
    this.index = 0;
  }
  _read() {
    if (this.index < this.Array.length) {
      this.push(this.Array[this.index++]);
    } else {
      this.push(null);
    }
  }
}

const parse = async () => {
  let header = false;
  for await (const chunk of reader) {
    parseCSVChunk(chunk, header);
    header = false;
  }
  return new createObjectStream(JsonData);
};

module.exports.parse = parse;
