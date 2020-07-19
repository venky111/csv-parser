const fs = require("fs");
const { Readable, Stream } = require("stream");
const path = require("path");

class JSONParser extends Readable {
  constructor(
    jsonObjectOrPathString,
    options = {
      encoding: "utf-8",
      is_file: false,
      delimeter: ",",
    }
  ) {
    super({ jsonObjectOrPathString, ...options, objectMode: true });
    this.jsonObjectOrPathString = jsonObjectOrPathString;
    this.options = options;
  }
  /**
   * Parse JSON To CSV.
   * @param {string} chunk JSON String.
   * @param {object} options CSV Options.
   * @returns {string} CSV String.
   */
  parseJsonToCSV(chunk, options = {}) {
    var array = typeof chunk !== "object" ? JSON.parse(chunk) : [chunk];
    const header = new Set();
    var str = "";
    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (let index in array[i]) {
        if (line !== "") line += options.delimeter ? options.delimeter : ",";
        if (typeof array[i][index] !== "object") {
          header.add(index);
          line += array[i][index];
        } else {
          const jsonResult = this.parseJsonToCSV(array[i][index], options);
          for (const newIndex of jsonResult[0]) {
            header.add(index + "__" + newIndex);
          }
          line += jsonResult[1];
        }
      }
      str += line + "\r\n";
    }
    return [header, str];
  }

  /**
   * The method is overridden from Readable class.
   * @returns ReadableStream
   */
  _read() {
    if (this.options.is_file) {
      const fileStream = fs.createReadStream(
        path.join(__dirname, this.jsonObjectOrPathString),
        {
          encoding: this.options.encoding || "utf-8",
        }
      );
      let flag = true;
      fileStream.on("data", (chunk) => {
        const csvChunk = this.parseJsonToCSV(chunk, this.options);
        if (flag) {
          this.push([...csvChunk[0]].join(this.options.delimeter));
          flag = false;
        }
        this.push(csvChunk[1]);
      });
      fileStream.on("close", () => {
        this.push(null);
      });
    } else {
    }
  }
}

module.exports = JSONParser;
