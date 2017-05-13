'use strict';

const fs = require('fs');
const fstb = require('../index');

let inputFormat, inputSource;
const outputFormat = 'gif';

if (process.platform == 'darwin') {
  inputFormat = 'avfoundation';
  inputSource = '0';
}

const proc = fstb.stream({
  inputFormat,
  inputParamsString: '-framerate 30',
  inputSource,
  outputFormat,
  outputParamsString: '-pix_fmt rgb8'
});

// setInterval(() => {
//   console.log('BUFFER: ', proc.getBuffer());
// }, 1000);

setTimeout(() => {
  let buffer = proc.killProcess();
  // console.log(buffer);
  fs.writeFileSync('./out.' + outputFormat, buffer);
  process.exit();
}, 15000);
