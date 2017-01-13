const fs = require('fs');
const fstb = require('../index');

let inputFormat, inputSource;
const outputFormat = 'gif';

if (process.platform == 'darwin') {
  inputFormat = 'avfoundation';
  inputSource = '0';
}

const proc = fstb.stream({
  inputFormat: inputFormat,
  inputFramerate: '30',
  inputSource: inputSource,
  outputPixFormat: 'rgb8',
  outputFormat
});

setInterval(() => {
  console.log('BUFFER: ', proc.getBuffer());
}, 1000);

setTimeout(() => {
  let buffer = proc.killProcess();
  fs.writeFileSync('./out.' + outputFormat, buffer);
  process.exit();
}, 15000);
