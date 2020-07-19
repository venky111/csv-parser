const fs = require("fs");
const { Readable } = require("stream");
const path = require("path");

const reader = fs.createReadStream("./utils/sample.csv", {
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

class JSONParser extends Readable {
  constructor(
    jsonObjectOrPathString,
    options = {
      encoding: "utf-8",
      is_file: false,
    }
  ) {
    super(jsonObjectOrPathString, options);
    this.jsonObjectOrPathString = jsonObjectOrPathString;
    this.options = options;
  }
  /**
   * Parse JSON To CSV.
   * @param {string} chunk JSON String.
   * @returns {string} CSV String.
   */
  parseJsonToCSV(chunk) {
    var array = typeof chunk !== "object" ? JSON.parse(chunk) : chunk;
    var str = "";
    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line !== "") line += ",";
        line += array[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  }
  _read() {
    if (this.options.is_file) {
      const fileStream = fs.createReadStream(this.jsonObjectOrPathString, {
        encoding: this.options.encoding || "utf-8",
      });
      fileStream.on("data", (chunk) => {
        const csvChunk = this.parseJsonToCSV(chunk);
        console.log(csvChunk);
      });
    } else {
    }
  }
}

const jsonParser = new JSONParser(path.join(__dirname, "./test.json"), {
  is_file: true,
});
jsonParser.on("data", (chunk) => {
  console.log("this", chunk);
});
//module.exports.parse = parse;
