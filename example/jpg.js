'use strict';

const fs = require('fs');
const fstb = require('../index');

let inputFormat, inputSource;
const outputFormat = 'jpg';

if (process.platform == 'darwin') {
  inputFormat = 'avfoundation';
  inputSource = '0';
}

const proc = fstb.stream({
  inputFormat: inputFormat,
  inputParamsString: '-framerate 30',
  inputSource: inputSource,
  outputFormat: 'image2pipe',
  outputParamsString: '-t 1',
  onProcessClose: (buffer) => {
    fs.writeFileSync('./out.' + outputFormat, buffer);
  }
});
