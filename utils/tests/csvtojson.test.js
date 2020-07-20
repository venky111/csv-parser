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
      const obj = JSON.parse(chunk);
      let i = 0;
      const keys = Object.keys(obj[0]);
      for (i = 0; i < keys.length; i += 1) {
        if (keys[i] !== transformHeader[i]) {
          match = false;
          break;
        }
      }
      expect(i).toBe(transformHeader.length);
    });
  });

  it('Should work with destination', () => {
    const transformHeader = ['KEY1', 'KEY2', 'KEY3'];
    const result = CSV.toJSON('key1,key2,key3\naaa ,  bbb , ccc\n', {
      header: true,
      isData: true,
      separator: ',',
      isRemoteUrl: false,
      destination:
        'E:\\the office\\venky\\work\\PestoAssignments\\deep-dive\\CSVParser\\csv-parser\\utils\\testdata\\output.txt',
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
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toHaveProperty('message', 'No file found.');
    }
  });
  it('check if transform function is working', () => {
    try {
      const result = CSV.toJSON('key1,key2,key3\naaa ,  bbb , ccc\n', {
        header: true,
        isData: true,
        separator: ',',
        isRemoteUrl: false,
        destination:
          'E:\\the office\\venky\\work\\PestoAssignments\\deep-dive\\CSVParser\\csv-parser\\utils\\testdata\\output.txt',
        transformHeader: (header) => header.toUpperCase(),
      });
      expect(result).toBe(true);
    } catch (e) {}
  });
});
