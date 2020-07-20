const { CSV } = require('../../index');
const fs = require('fs');
const path = require('path');

describe('CSV.ToJSON', () => {
  it('transform headers should work', () => {
    const transformHeader = ['KEY1', 'KEY2', 'KEY3'];
    CSV.toJSON('key1,key2,key3\naaa ,  bbb , ccc\n', {
      header: true,
      isData: true,
      separator: ',',
      isRemoteUrl: false,
      transformHeader: transformHeader,
    }).on('data', (chunk) => {
      const obj = JSON.parse(chunk[0]);
      console.log(chunk[0], obj);
      let i = 0;
      //const keys = Object.keys(obj);
      for (i = 0; i < keys.length; i += 1) {
        if (keys[i] !== transformHeader[i]) {
          match = false;
          break;
        }
      }
    });
  });
  it('Should work with destination', () => {
    const transformHeader = ['KEY1', 'KEY2', 'KEY3'];
    const result = CSV.toJSON('key1,key2,key3\naaa ,  bbb , ccc\n', {
      header: true,
      isData: true,
      separator: ',',
      isRemoteUrl: false,
      destination: '../tests/output.txt',
      transformHeader: transformHeader,
    });
    expect(result).toBe(true);
  });
  it('check if input file path is valid', () => {
    try {
      CSV.toJSON('invalidfile path', {
        header: true,
        isData: true,
        separator: ',',
        isRemoteUrl: false,
        destination: '../tests/output.txt',
        transformHeader: transformHeader,
      });
    } catch (e) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'No file found.');
    }
  });
});
